import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { PaginatedNews } from '@/types/entities';

const useNewsList = ({
	page,
	limit,
	dateRange,
	search,
	published,
}: {
	page: number;
	limit: number;
	dateRange?: { from?: Date; to?: Date };
	search?: string;
	published?: string;
}) => {
	const api = useApi();

	return useQuery({
		queryKey: ['news-list', { page, limit, dateRange, search, published }],
		queryFn: async (): Promise<PaginatedNews> => {
			const params = new URLSearchParams({
				page: String(page),
				limit: String(limit),
				...(dateRange?.from && { from: dateRange.from.toISOString() }),
				...(dateRange?.to && { to: dateRange.to.toISOString() }),
				...(search && { search }),
				...(published && { published }),
			});

			const url = `/news/paginated?${params.toString()}`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useNewsList;
