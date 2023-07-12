import Input from '@/components/Input';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const Auth = () => {
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');

	const [variant, setVariant] = useState('login');

	const toggleVariant = useCallback(() => {
		setVariant((currentVariant) =>
			currentVariant === 'login' ? 'signup' : 'login',
		);
	}, []);

	const router = useRouter();

	const login = useCallback(async () => {
		try {
			await signIn('credentials', {
				redirect: false,
				email,
				password,
				callbackUrl: '/',
			});

			router.push('/');
		} catch (error) {
			console.error(error);
		}
	}, [email, password, router]);

	const register = useCallback(async () => {
		try {
			await axios.post('/api/register', {
				email,
				name,
				password,
			});

			login();
		} catch (error) {
			console.error(error);
		}
	}, [email, name, password, login]);

	return (
		<div className="relative h-full w-full bg-no-repeat bg-center bg-fixed bg-cover bg-[url('/images/hero.jpg')]">
			<div className='bg-black w-full h-full lg:bg-opacity-50'>
				<div className='px-12 py-5'>
					<Image
						priority={true}
						src='/images/logo.png'
						alt='Logo'
						className='h-12'
						width={178}
						height={48}
					/>
				</div>
				<div className='flex justify-center'>
					<div className='bg-black bg-opacity-70 p-16 self-center mt-2 lg:w-2/5 rounded-md w-full'>
						<h2 className='text-white text-4xl mb-8 font-semibold'>
							{variant === 'login' ? 'Sign In' : 'Register'}
						</h2>
						<div className='flex flex-col gap-4'>
							{variant === 'signup' && (
								<Input
									label='Username'
									onChange={(e: any) =>
										setName(e.target.value)
									}
									id='username'
									type='text'
									value={name}
								/>
							)}

							<Input
								label='Email'
								onChange={(e: any) => setEmail(e.target.value)}
								id='email'
								type='email'
								value={email}
							/>
							<Input
								label='Password'
								onChange={(e: any) =>
									setPassword(e.target.value)
								}
								id='password'
								type='password'
								value={password}
							/>
						</div>
						<button
							onClick={variant === 'login' ? login : register}
							className='bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition'>
							{variant === 'login' ? 'Sign In' : 'Sign Up'}
						</button>

						<div className='flex flex-row items-center gap-4 mt-8 justify-center'>
							<div
								onClick={() =>
									signIn('google', { callbackUrl: '/' })
								}
								className='w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition'>
								<FcGoogle size={30} />
							</div>

							<div
								onClick={() =>
									signIn('github', { callbackUrl: '/' })
								}
								className='w-[41.5px] h-[41.5px] bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition'>
								<FaGithub size={30} className='text-black' />
							</div>
						</div>

						<p className='text-neutral-500 mt-12'>
							{variant === 'login'
								? 'First time using Netflix?'
								: 'Already have an account?'}
							<span
								className='text-white ml-1.5 hover:underline cursor-pointer'
								onClick={toggleVariant}>
								{variant === 'login'
									? 'Create an account?'
									: 'Login'}
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Auth;
