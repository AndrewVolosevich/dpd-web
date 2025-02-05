import { cookies } from 'next/headers';
import { ACCESS_TOKEN, REFRESH_TOKEN, USER } from '@/const/common';

export async function POST() {
	const cookieStore = await cookies();
	await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/logout`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Cookie: cookieStore.toString(),
		},
	});
	cookieStore.set(USER, '');
	cookieStore.delete(USER);
	cookieStore.set(REFRESH_TOKEN, '');
	cookieStore.delete(REFRESH_TOKEN);
	cookieStore.set(ACCESS_TOKEN, '');
	cookieStore.delete(ACCESS_TOKEN);

	return new Response('Success', {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
