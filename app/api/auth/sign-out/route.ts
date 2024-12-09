import { cookies } from 'next/headers';

export async function POST() {
	const cookieStore = await cookies();
	await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/logout`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Cookie: cookieStore.toString(),
		},
	});
	cookieStore.set('user', '');
	cookieStore.delete('user');
	cookieStore.set('refreshToken', '');
	cookieStore.delete('refreshToken');

	return new Response('Success', {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
