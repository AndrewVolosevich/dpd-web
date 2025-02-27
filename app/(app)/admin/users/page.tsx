import UsersPage from '@/components/pages/Admin/Users/UsersPage';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/getQueryClient';
import getServerTokenFromCookies from '@/lib/getServerTokenFromCookies';
import { prefetchPaginatedUsers } from '@/lib/api/queries/Users/prefetchPaginatedUsers';

export default async function News() {
	const queryClient = getQueryClient();
	const token = await getServerTokenFromCookies();

	await queryClient.prefetchQuery({
		queryKey: ['paginated-users', { page: 1, limit: 20 }],
		queryFn: async () => {
			return prefetchPaginatedUsers({ ...{ page: 1, limit: 20 }, token });
		},
		retry: false,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<UsersPage />
		</HydrationBoundary>
	);
}
