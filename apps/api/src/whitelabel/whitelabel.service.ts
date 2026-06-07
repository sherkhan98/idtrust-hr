import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

export interface WhiteLabelConfig {
  companyName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  accentColor: string;
  theme: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'dark';
  loginWelcomeText: string;
  loginBackground: 'gradient' | 'solid' | 'image';
  loginBgValue: string;
  showFeatureList: boolean;
  customDomain?: string;
  subdomain: string;
  emailFromName: string;
  emailFromAddress: string;
  emailHeaderColor: string;
  emailFooterText: string;
  sslEnabled: boolean;
}

const DEFAULT_CONFIG: WhiteLabelConfig = {
  companyName: 'StaffFlow HR',
  tagline: 'Enterprise HR Platform',
  primaryColor: '#2563EB',
  accentColor: '#7C3AED',
  theme: 'blue',
  loginWelcomeText: "O'zbekiston uchun zamonaviy HR tizimi",
  loginBackground: 'gradient',
  loginBgValue: 'from-blue-600 to-indigo-800',
  showFeatureList: true,
  subdomain: 'app',
  emailFromName: 'StaffFlow HR',
  emailFromAddress: 'noreply@staffflow.uz',
  emailHeaderColor: '#2563EB',
  emailFooterText: '© 2024 StaffFlow HR. Made in Uzbekistan',
  sslEnabled: true,
};

@Injectable()
export class WhiteLabelService {
  constructor(private prisma: PrismaService) {}

  async getConfig(tenantId: string): Promise<WhiteLabelConfig> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { settings: true, name: true, slug: true, logo: true },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const saved = (tenant.settings as any)?.whiteLabel || {};
    return {
      ...DEFAULT_CONFIG,
      ...saved,
      companyName: saved.companyName || tenant.name,
      logoUrl: saved.logoUrl || tenant.logo,
      subdomain: tenant.slug,
    };
  }

  async updateConfig(tenantId: string, config: Partial<WhiteLabelConfig>) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const current = (tenant.settings as any) || {};
    const updated = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        settings: { ...current, whiteLabel: { ...(current.whiteLabel || {}), ...config } },
        ...(config.companyName && { name: config.companyName }),
        ...(config.logoUrl && { logo: config.logoUrl }),
      },
    });
    return (updated.settings as any)?.whiteLabel;
  }

  async validateDomain(domain: string): Promise<{ available: boolean; cnameRecord: string }> {
    // In production: check DNS CNAME record
    return {
      available: true,
      cnameRecord: `CNAME ${domain} → app.staffflow.uz`,
    };
  }

  async uploadLogo(tenantId: string, fileBuffer: Buffer, mimeType: string) {
    // In production: upload to S3 and return URL
    const fakeUrl = `https://staffflow-hr.s3.amazonaws.com/logos/${tenantId}.png`;
    await this.updateConfig(tenantId, { logoUrl: fakeUrl });
    return { url: fakeUrl };
  }
}
