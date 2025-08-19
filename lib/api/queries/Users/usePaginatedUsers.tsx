import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { PaginatedUsers } from '@/types/entities';

const usePaginatedUsers = ({
	page,
	limit,
	search,
	departmentId,
}: {
	page: number;
	limit: number;
	search?: string;
	departmentId?: string;
}) => {
	const api = useApi();

	return useQuery({
		queryKey: ['paginated-users', { page, limit, search, departmentId }],
		queryFn: async (): Promise<PaginatedUsers> => {
			const resp = await api.post(`/auth/get-paginated-users`, {
				page,
				limit,
				search,
				sortRule: 'surname',
				departmentId,
			});
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default usePaginatedUsers;
