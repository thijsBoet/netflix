import { NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';

import prismadb from '@/libs/prismadb';

const serverAuth = async (req: NextApiRequest) => {
	const session = await getSession({ req });
	if (!session) {
		throw new Error('Not authenticated');
	}

	const currentUser = await prismadb?.users?.findUnique({
		where: { email: session?.user?.email },
	});

  if (!currentUser) {
    throw new Error('Not authenticated');
	}

  return { currentUser };
};

export default serverAuth;