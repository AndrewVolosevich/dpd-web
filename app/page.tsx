import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';
import { HomePage } from '@/components/pages/Home/HomePage';
import { getQueryClient } from '@/lib/getQueryClient';
import getServerTokenFromCookies from '@/lib/getServerTokenFromCookies';
import { prefetchNewsList } from '@/lib/api/queries/News/prefetchNewsList';
import { prefetchUsersByBirthday } from '@/lib/api/queries/Users/prefetchUsersByBirthday';
import { prefetchNewUsers } from '@/lib/api/queries/Users/prefetchNewUsers';

export default async function Home() {
	const queryClient = getQueryClient();
	const token = await getServerTokenFromCookies();

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ['news-list', { page: 1, limit: 4 }],
			queryFn: () => prefetchNewsList({ page: 1, limit: 4, token }),
			retry: false,
		}),
		queryClient.prefetchQuery({
			queryKey: ['users-by-birthdays'],
			queryFn: () => prefetchUsersByBirthday({ token }),
			retry: false,
		}),
		queryClient.prefetchQuery({
			queryKey: ['new-users', { limit: 6 }],
			queryFn: () => prefetchNewUsers({ limit: 6, token }),
			retry: false,
		}),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<HomePage />
		</HydrationBoundary>
	);
}
