import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';

const useSurveysList = ({
	status,
	sort,
	search,
}: {
	status?: string;
	sort?: string;
	search?: string;
}) => {
	const api = useApi();

	return useQuery({
		queryKey: ['surveys-list', { status, sort, search }],
		queryFn: async (): Promise<any> => {
			const params = new URLSearchParams({
				...(search && { search }),
				...(sort && { sort }),
				...(status && { status }),
			});

			const url = `/surveys?${params.toString()}`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useSurveysList;
