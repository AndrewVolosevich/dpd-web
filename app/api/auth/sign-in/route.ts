import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
	const data = await req.json();
	const cookieHeader = await cookies();
	const resp = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/login`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: cookieHeader.toString(),
			},
			body: JSON.stringify(data),
		},
	);
	const newResp = await resp.json();

	return new Response(JSON.stringify({ ...newResp }), {
		status: 200,
		headers: {
			'Set-Cookie': `user=${JSON.stringify({ ...newResp }) || ''}; Path=/; HttpOnly; Secure; SameSite=None`,
			'Content-Type': 'application/json',
		},
	});
}
