import { NewsListPage } from '@/components/pages/News/NewsListPage';
import { getQueryClient } from '@/lib/getQueryClient';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { prefetchNewsList } from '@/lib/api/queries/News/prefetchNewsList';
import { endOfDay } from 'date-fns';
import getServerTokenFromCookies from '@/lib/getServerTokenFromCookies';

export default async function News() {
	const queryClient = getQueryClient();
	const token = await getServerTokenFromCookies();

	const prefetchedProps = {
		page: 1,
		limit: 10,
		dateRange: {
			from: new Date(2025, 0, 1),
			to: endOfDay(new Date()),
		},
	};

	await queryClient.prefetchQuery({
		queryKey: ['news-list', prefetchedProps],
		queryFn: async () => {
			return prefetchNewsList({ ...prefetchedProps, token });
		},
		retry: false,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<NewsListPage />
		</HydrationBoundary>
	);
}
