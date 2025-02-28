import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { Survey } from '@/types/entities';

const useSurveysList = ({
	status,
	sort,
	search,
	unpassedOnly,
}: {
	status?: string;
	sort?: string;
	search?: string;
	unpassedOnly?: string;
}) => {
	const api = useApi();

	return useQuery({
		queryKey: ['surveys-list', { status, sort, search }],
		queryFn: async (): Promise<Survey[]> => {
			const params = new URLSearchParams({
				...(search && { search }),
				...(sort && { sort }),
				...(status && { status }),
				...(unpassedOnly && { unpassedOnly }),
			});

			const url = `/surveys?${params.toString()}`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useSurveysList;
