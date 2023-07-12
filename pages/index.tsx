import useCurrentUser from '@/hooks/useCurrentUser';
import { NextPageContext } from 'next';
import { getSession, signOut } from 'next-auth/react';

export async function getServerSideProps(context: NextPageContext) {
	const session = await getSession(context);

	if (!session) {
		return {
			redirect: {
				destination: '/auth',
				permanent: false,
			},
		};
	}

	return {
		props: { session },
	};
}

export default function Home() {
	const { data: user } = useCurrentUser();

	return (
		<>
			<main>
				<h1 className='text-4xl text-white'>Netflix</h1>
				<p className='text-white'>Logged in as : {user?.name}</p>
				<button
					className='h-10 w-full bg-white text-black'
					onClick={() => signOut()}>
					Logout!
				</button>
			</main>
		</>
	);
}
