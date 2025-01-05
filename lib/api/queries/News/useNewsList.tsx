import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { PaginatedNews } from '@/types/entities';

const useNewsList = ({ page, limit }: { page: number; limit: number }) => {
	const api = useApi();

	return useQuery({
		queryKey: ['news', 'news-list', { page, limit }],
		queryFn: async (): Promise<PaginatedNews> => {
			const resp = await api(
				`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/news/paginated?page=${page}&limit=${limit}`,
				{
					method: 'GET',
				},
			);
			return resp?.json();
		},
		placeholderData: keepPreviousData,
	});
};

export default useNewsList;
