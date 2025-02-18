import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';

const useSurveysList = () => {
	const api = useApi();

	return useQuery({
		queryKey: ['surveys-list'],
		queryFn: async (): Promise<any> => {
			const url = `/surveys`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useSurveysList;
