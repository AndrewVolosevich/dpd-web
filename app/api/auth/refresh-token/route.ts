import { cookies } from 'next/headers';
import { ACCESS_TOKEN, REFRESH_TOKEN, USER } from '@/const/common';

export async function GET() {
	const cookieStore = await cookies();
	const resp = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/refresh-token`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Cookie: cookieStore.toString(),
			},
			credentials: 'include',
		},
	);
	const newResp = await resp.json();

	if (newResp?.accessToken) {
		cookieStore.set(ACCESS_TOKEN, newResp?.accessToken, {
			path: '/',
			maxAge: 2592000,
		});
	}

	if (newResp?.refreshToken) {
		cookieStore.set(REFRESH_TOKEN, newResp?.refreshToken, {
			path: '/',
			maxAge: 2592000,
		});
	}

	if (!newResp?.user || !newResp?.refreshToken) {
		return new Response(JSON.stringify({ message: 'Can not refresh token' }), {
			status: 404,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	cookieStore.set(USER, `${JSON.stringify({ ...newResp?.user }) || ''}`, {
		path: '/',
		maxAge: 2592000,
	});

	return new Response(JSON.stringify({ ...newResp }), {
		status: resp?.status,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
