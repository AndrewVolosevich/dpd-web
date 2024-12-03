import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
	const data = await req?.json();
	const cookieUser = (await cookies()).get('user')?.value;
	const userIdFromCookies = cookieUser ? JSON.parse(cookieUser) : '';

	const userId = data?.userId || userIdFromCookies?.id;
	console.log('===', `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/logout`);
	await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/logout`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Cookie: cookies().toString(),
		},
		body: JSON.stringify({ userId }),
	});

	return new Response('Success', {
		status: 200,
		headers: {
			'Set-Cookie': `user=${''}; Path=/; HttpOnly`,
			'Content-Type': 'application/json',
		},
	});
}
