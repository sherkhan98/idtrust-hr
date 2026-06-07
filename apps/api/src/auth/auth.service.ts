import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { RedisService } from '../common/redis/redis.service';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { tenant: true },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (user.mfaEnabled) {
      if (!loginDto.mfaCode) {
        return { requiresMfa: true, userId: user.id };
      }
      const isValidMfa = speakeasy.totp.verify({
        secret: user.mfaSecret!,
        encoding: 'base32',
        token: loginDto.mfaCode,
        window: 1,
      });
      if (!isValidMfa) {
        throw new UnauthorizedException('Invalid MFA code');
      }
    }

    const tokens = await this.generateTokens(user);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), lastLoginIp: ipAddress },
    });

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress,
        userAgent,
      },
    });

    const { passwordHash, mfaSecret, ...userSafe } = user;
    const settings = (user.tenant?.settings as any) || {};
    const cloudType: string = settings.cloudType || 'hr';
    return { ...tokens, user: { ...userSafe, cloudType } };
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: registerDto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    // Derive first/last from adminName if not provided separately
    let firstName: string = registerDto.firstName ?? '';
    let lastName: string = registerDto.lastName ?? '';
    if (!firstName && registerDto.adminName) {
      const parts = registerDto.adminName.trim().split(/\s+/);
      firstName = parts[0];
      lastName = parts.slice(1).join(' ') || parts[0];
    }
    if (!firstName) firstName = registerDto.email.split('@')[0];
    if (!lastName) lastName = firstName;

    let tenant: any = null;
    if (registerDto.companyName) {
      const slug = registerDto.companyName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 50);

      tenant = await this.prisma.tenant.create({
        data: {
          name: registerDto.companyName,
          slug: `${slug}-${Date.now()}`,
          plan: 'STARTER',
          settings: {
            companySize: registerDto.companySize,
            industry: registerDto.industry,
            cloudType: registerDto.cloudType || 'hr',
          },
        },
      });
    }

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        phone: registerDto.phone,
        telegramChatId: registerDto.telegramId || null,
        role: tenant ? 'TENANT_ADMIN' : 'EMPLOYEE',
        tenantId: tenant?.id,
      },
      include: { tenant: true },
    });

    const tokens = await this.generateTokens(user);
    const { passwordHash: _, mfaSecret, ...userSafe } = user;
    return { ...tokens, user: userSafe };
  }

  async refreshToken(refreshToken: string) {
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: { include: { tenant: true } } },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (tokenRecord.user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account suspended');
    }

    const tokens = await this.generateTokens(tokenRecord.user);

    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: {
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return tokens;
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.deleteMany({
        where: { userId, token: refreshToken },
      });
    } else {
      await this.prisma.refreshToken.deleteMany({ where: { userId } });
    }
    await this.redisService.del(`user:${userId}:session`);
    return { message: 'Logged out successfully' };
  }

  async enableMfa(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const secret = speakeasy.generateSecret({
      name: `StaffFlow HR (${user.email})`,
      issuer: 'StaffFlow HR',
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: secret.base32 },
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);
    return { secret: secret.base32, qrCode: qrCodeUrl };
  }

  async verifyMfa(userId: string, code: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    if (!user.mfaSecret) {
      throw new BadRequestException('MFA not set up');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: code,
      window: 1,
    });

    if (!isValid) {
      throw new BadRequestException('Invalid MFA code');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: true },
    });

    return { message: 'MFA enabled successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenant: true,
        employee: {
          include: {
            department: true,
            position: true,
            branch: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, mfaSecret, ...userSafe } = user;
    return userSafe;
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
