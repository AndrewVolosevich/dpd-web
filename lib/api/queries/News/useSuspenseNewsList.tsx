import { useSuspenseQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { PaginatedNews } from '@/types/entities';

const useSuspenseNewsList = ({
	page,
	limit,
}: {
	page: number;
	limit: number;
}) => {
	const api = useApi();

	return useSuspenseQuery({
		queryKey: ['news', { page, limit }],
		queryFn: async (): Promise<PaginatedNews> => {
			const resp = await api.get(`/news/paginated?page=${page}&limit=${limit}`);

			return resp?.data;
		},
	});
};

export default useSuspenseNewsList;
