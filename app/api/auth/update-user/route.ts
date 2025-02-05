import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { USER } from '@/const/common';

export async function POST(req: NextRequest) {
	const data = await req.json();
	const cookieStore = await cookies();
	const user = data?.user;

	if (!user) {
		return new Response(JSON.stringify({ message: 'User cookie not found' }), {
			status: 404,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
	cookieStore.set(USER, `${JSON.stringify({ ...user }) || ''}`, {
		path: '/',
		maxAge: 2592000,
	});

	return new Response(user, {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
