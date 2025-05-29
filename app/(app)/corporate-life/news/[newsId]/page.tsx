import NewsPage from '@/components/pages/News/NewsPage';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/getQueryClient';
import getServerTokenFromCookies from '@/lib/getServerTokenFromCookies';
import { prefetchNews } from '@/lib/api/queries/News/prefetchNews';

interface NewsPageProps {
	params: Promise<{
		newsId: string;
	}>;
}

export default async function NewsById({ params }: NewsPageProps) {
	const { newsId } = await params;

	const queryClient = getQueryClient();
	const token = await getServerTokenFromCookies();

	await queryClient.prefetchQuery({
		queryKey: ['news', { newsId }],
		queryFn: async () => {
			return prefetchNews({ newsId, token });
		},
		retry: false,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<NewsPage newsId={newsId} />
		</HydrationBoundary>
	);
}
