import { cookies } from 'next/headers';

export async function POST() {
	const cookieStore = await cookies();
	await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/logout`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Cookie: cookies().toString(),
		},
	});
	cookieStore.set('user', '');
	cookieStore.delete('user');

	return new Response('Success', {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
