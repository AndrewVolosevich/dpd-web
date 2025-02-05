import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';
import { ProfilePage } from '@/components/pages/Profile/ProfilePage';
import { getQueryClient } from '@/lib/getQueryClient';
import getServerTokenFromCookies from '@/lib/getServerTokenFromCookies';
import { prefetchAnotherUser } from '@/lib/api/queries/Users/prefetchAnotherUser';

interface ProfilePageProps {
	params: Promise<{
		userId: string;
	}>;
}

export default async function Profile({ params }: ProfilePageProps) {
	const { userId } = await params;

	const queryClient = getQueryClient();
	const token = await getServerTokenFromCookies();

	await queryClient.prefetchQuery({
		queryKey: ['another-user', { userId }],
		queryFn: async () => {
			return prefetchAnotherUser({ userId, token });
		},
		retry: false,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProfilePage id={userId} />
		</HydrationBoundary>
	);
}
