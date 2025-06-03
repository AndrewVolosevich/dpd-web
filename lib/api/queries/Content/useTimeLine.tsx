import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { TimeLine } from '@/types/content';

const useTimeLine = () => {
	const api = useApi();

	return useQuery({
		queryKey: ['time-line'],
		queryFn: async (): Promise<TimeLine[]> => {
			const url = `/content/time-line`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useTimeLine;
