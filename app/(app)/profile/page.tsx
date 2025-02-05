import { getQueryClient } from '@/lib/getQueryClient';

export const dynamic = 'force-dynamic';
import { ProfilePage } from '@/components/pages/Profile/ProfilePage';
import getServerTokenFromCookies from '@/lib/getServerTokenFromCookies';
import { prefetchAnotherUser } from '@/lib/api/queries/Users/prefetchAnotherUser';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { USER } from '@/const/common';

export default async function Profile() {
	const queryClient = getQueryClient();
	const token = await getServerTokenFromCookies();
	const cookieStore = await cookies();
	const userCookie = cookieStore.get(USER);
	const userId = JSON.parse(userCookie?.value || '')?.id || '';
	await queryClient.prefetchQuery({
		queryKey: ['another-user', { userId }],
		queryFn: async () => {
			return prefetchAnotherUser({ userId, token });
		},
		retry: false,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProfilePage />
		</HydrationBoundary>
	);
}
