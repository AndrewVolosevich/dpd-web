import { cookies } from 'next/headers';

export async function GET() {
	const cookieStore = await cookies();
	const user = cookieStore.get('user')?.value;

	return new Response(user, {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
