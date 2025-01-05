import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { PaginatedUsers } from '@/types/entities';

const usePaginatedUsers = ({
	page,
	limit,
}: {
	page: number;
	limit: number;
}) => {
	const api = useApi();

	return useQuery({
		queryKey: ['paginated-users', { page, limit }],
		queryFn: async (): Promise<PaginatedUsers> => {
			const resp = await api(
				`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/get-paginated-users`,
				{
					method: 'POST',
					body: JSON.stringify({ page, limit, sortRule: 'surname' }),
				},
			);
			return resp?.json();
		},
		placeholderData: keepPreviousData,
	});
};

export default usePaginatedUsers;
