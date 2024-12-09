import { cookies } from 'next/headers';

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

	const refreshTokenMatch = resp?.headers
		?.get('set-cookie')
		?.match(/refreshToken=([^;]+)/);
	const refreshToken = refreshTokenMatch ? refreshTokenMatch[1] : null;

	if (refreshToken) {
		cookieStore.set('refreshToken', refreshToken, {
			path: '/',
			maxAge: 2592000,
		});
	}

	if (!newResp?.user || !refreshToken) {
		return new Response(JSON.stringify({ message: 'Can not refresh token' }), {
			status: 404,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	cookieStore.set('user', `${JSON.stringify({ ...newResp?.user }) || ''}`, {
		path: '/',
		maxAge: 2592000,
	});

	return new Response(JSON.stringify({ ...newResp }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
