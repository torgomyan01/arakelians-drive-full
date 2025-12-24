import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error(
    'NEXTAUTH_SECRET is not set. Please set it in your environment variables.'
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('[NextAuth] Missing credentials');
            return null;
          }

          console.log('[NextAuth] Attempting login for:', credentials.email);

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            console.error('[NextAuth] User not found:', credentials.email);
            return null;
          }

          console.log('[NextAuth] User found:', {
            id: user.id,
            email: user.email,
            role: user.role,
          });

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.error(
              '[NextAuth] Invalid password for:',
              credentials.email
            );
            return null;
          }

          console.log('[NextAuth] Login successful for:', credentials.email);

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name || user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('[NextAuth] Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
