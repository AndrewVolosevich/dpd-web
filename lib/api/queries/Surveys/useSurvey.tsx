import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';

const useSurvey = (id?: string) => {
	const api = useApi();

	return useQuery({
		queryKey: ['survey', { id }],
		queryFn: async (): Promise<any> => {
			const url = `/surveys/${id}`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useSurvey;
