import { cookies } from 'next/headers';

export async function GET() {
	const cookieHeader = await cookies();
	const cookieUser = cookieHeader.get('user')?.value;
	const userFromCookies = cookieUser ? JSON.parse(cookieUser) : '';
	const userId = userFromCookies?.id;

	if (!userId || !userFromCookies?.name) {
		if (userId) {
			await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/logout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Cookie: cookieHeader.toString(),
				},
				body: JSON.stringify({ userId }),
			});
		}

		return new Response('Fail', {
			status: 404,
			headers: {
				'Set-Cookie': `user=${''}; Path=/; HttpOnly`,
				'Content-Type': 'application/json',
			},
		});
	} else {
		return new Response(JSON.stringify({ ...userFromCookies }), {
			status: 200,
			headers: {
				'Set-Cookie': `user=${JSON.stringify({ ...userFromCookies })}; Path=/; HttpOnly`,
				'Content-Type': 'application/json',
			},
		});
	}
}
