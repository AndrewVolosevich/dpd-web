import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { PaginatedNews } from '@/types/entities';

const useNewsList = ({ page, limit }: { page: number; limit: number }) => {
	const api = useApi();

	return useQuery({
		queryKey: ['news', 'news-list', { page, limit }],
		queryFn: async (): Promise<PaginatedNews> => {
			const resp = await api.get(`/news/paginated?page=${page}&limit=${limit}`);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useNewsList;
