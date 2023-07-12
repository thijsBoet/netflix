import nextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';

import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { PrismaAdapter } from '@next-auth/prisma-adapter';

import prismadb from '@/lib/prismadb';

export default nextAuth({
	providers: [
		GithubProvider({
			clientId: process.env.NEXTAUTH_GITHUB_ID || "",
			clientSecret: process.env.NEXTAUTH_GITHUB_SECRET || "",
		}),
		GoogleProvider({
			clientId: process.env.NEXTAUTH_GOOGLE_ID || "",
			clientSecret: process.env.NEXTAUTH_GOOGLE_SECRET || "",
		}),
		Credentials({
			id: 'credentials',
			name: 'Credentials',
			credentials: {
				email: {
					label: 'Email',
					type: 'text',
				},
				password: {
					label: 'Password',
					type: 'password',
				},
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error('Email and Password required');
				}

				const user = await prismadb.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				if (!user || !user.hashedPassword) {
					throw new Error('Invalid email or password');
				}

				const isCorrectPassword = await compare(
					credentials.password,
					user.hashedPassword,
				);

				if (!isCorrectPassword) {
					throw new Error('Invalid email or password');
				}

				return user;
			},
		}),
	],
	pages: {
		signIn: '/auth',
	},
	debug: process.env.NODE_ENV === 'development',
	adapter: PrismaAdapter(prismadb),
	session: {
		strategy: 'jwt',
	},
	jwt: {
		secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
});
