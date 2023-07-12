import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function register(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const { email, name, password } = req.body;

		const existingUser = await prismadb.user.findUnique({
			where: {
				email,
			},
		});

		if (existingUser) {
			return res.status(422).json({ error: 'User already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const user = await prismadb.user.create({
			data: {
				email,
				name,
				hashedPassword,
				image: '',
				emailVerified: new Date(),
			},
		});

		return res.status(201).json({ message: 'User created', user });
	} catch (error) {
		console.error(error);
		return res.status(400).end();
	}
}
