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
			const resp = await api.post(`/auth/get-paginated-users`, {
				page,
				limit,
				sortRule: 'surname',
			});
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default usePaginatedUsers;
