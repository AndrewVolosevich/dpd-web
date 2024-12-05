import { cookies } from 'next/headers';

export async function GET() {
	const cookieStore = await cookies();
	const cookieUser = cookieStore.get('user')?.value;
	const userFromCookies = cookieUser ? JSON.parse(cookieUser) : '';
	const userId = userFromCookies?.id;

	if (!userId || !userFromCookies?.name) {
		if (userId) {
			await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/logout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Cookie: cookieStore.toString(),
				},
				body: JSON.stringify({ userId }),
			});
		}

		cookieStore.set('user', '');
		cookieStore.delete('user');
		return new Response('Fail', {
			status: 404,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} else {
		cookieStore.set('user', `${JSON.stringify({ ...userFromCookies }) || ''}`, {
			path: '/',
			maxAge: 604800,
		});
		return new Response(JSON.stringify({ ...userFromCookies }), {
			status: 200,
			headers: {
				'Set-Cookie': `user=${JSON.stringify({ ...userFromCookies })}; Path=/; HttpOnly`,
				'Content-Type': 'application/json',
			},
		});
	}
}
