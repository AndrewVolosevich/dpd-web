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
			const params = new URLSearchParams({
				page: String(page),
				limit: String(limit),
				...(dateRange?.from && { from: dateRange.from.toISOString() }),
				...(dateRange?.to && { to: dateRange.to.toISOString() }),
			});

			const url = `/news/paginated?${params.toString()}`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useNewsList;
