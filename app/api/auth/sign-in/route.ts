import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
	const data = await req.json();
	const cookieStore = await cookies();
	const resp = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/login`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify(data),
		},
	);
	const newResp = await resp.json();

	cookieStore.set('user', `${JSON.stringify({ ...newResp?.user }) || ''}`, {
		path: '/',
		maxAge: 2592000,
	});

	if (newResp?.accessToken) {
		cookieStore.set('accessToken', newResp?.accessToken, {
			path: '/',
			maxAge: 2592000,
		});
	}

	if (newResp?.refreshToken) {
		cookieStore.set('refreshToken', newResp?.refreshToken, {
			path: '/',
			maxAge: 2592000,
		});
	}

	return new Response(JSON.stringify({ ...newResp }), {
		status: resp?.status,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
