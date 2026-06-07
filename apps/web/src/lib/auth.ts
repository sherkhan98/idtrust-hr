import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const API_URL = process.env.NEXTAUTH_API_URL || process.env.API_URL || 'http://localhost:4000';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        mfaCode: { label: 'MFA Code', type: 'text' },
      },
      async authorize(credentials) {
        try {
          const loginUrl = `${API_URL}/api/v1/auth/login`;
          console.log('[NextAuth] Login attempt:', credentials?.email, '→', loginUrl);
          const body: Record<string, string> = {
            email: credentials?.email || '',
            password: credentials?.password || '',
          };
          if (credentials?.mfaCode && credentials.mfaCode.length === 6) {
            body.mfaCode = credentials.mfaCode;
          }
          const response = await axios.post(loginUrl, body, { timeout: 10000 });

          const data = response.data;
          if (data.requiresMfa) {
            throw new Error('REQUIRES_MFA');
          }

          if (data.accessToken && data.user) {
            return {
              ...data.user,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            };
          }
          return null;
        } catch (error: any) {
          const msg = error.response?.data?.message || error.message;
          console.error('[NextAuth] Login error:', msg, 'code:', error.code, 'status:', error.response?.status);
          throw new Error(msg || 'Invalid credentials');
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as any).role;
        token.tenantId = (user as any).tenantId;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.cloudType = (user as any).cloudType || 'hr';
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        role: token.role as string,
        tenantId: token.tenantId as string,
        firstName: token.firstName as string,
        lastName: token.lastName as string,
        cloudType: token.cloudType as string,
      };
      (session as any).accessToken = token.accessToken;
      (session as any).refreshToken = token.refreshToken;
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      tenantId: string;
      firstName: string;
      lastName: string;
      cloudType: string;
      name?: string | null;
      image?: string | null;
    };
    accessToken: string;
  }
}
