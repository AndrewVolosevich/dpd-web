import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { PaginatedNews } from '@/types/entities';

const useNewsList = ({
	page,
	limit,
	dateRange,
}: {
	page: number;
	limit: number;
	dateRange?: { from?: Date; to?: Date };
}) => {
	const api = useApi();

	return useQuery({
		queryKey: ['news-list', { page, limit, dateRange }],
		queryFn: async (): Promise<PaginatedNews> => {
			const resp = await api.get(
				`/news/paginated?page=${page}&limit=${limit}&from=${dateRange?.from || ''}&to=${dateRange?.to || ''}`,
			);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useNewsList;
