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
				Cookie: cookieStore.toString(),
			},
			body: JSON.stringify(data),
		},
	);
	const newResp = await resp.json();

	cookieStore.set('user', `${JSON.stringify({ ...newResp?.user }) || ''}`, {
		path: '/',
		maxAge: 604800,
	});

	return new Response(JSON.stringify({ ...newResp }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
