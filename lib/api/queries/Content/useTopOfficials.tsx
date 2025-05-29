import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { TopOfficial } from '@/types/content';

const useTopOfficials = () => {
	const api = useApi();

	return useQuery({
		queryKey: ['top-officials'],
		queryFn: async (): Promise<TopOfficial[]> => {
			const url = `/content/top-officials`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useTopOfficials;
