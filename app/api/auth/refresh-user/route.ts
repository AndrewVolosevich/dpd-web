import { cookies } from 'next/headers';
import { USER } from '@/const/common';

export async function GET() {
	const cookieStore = await cookies();
	const user = cookieStore.get(USER)?.value;

	if (!user) {
		return new Response(JSON.stringify({ message: 'User cookie not found' }), {
			status: 404,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	return new Response(user, {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
