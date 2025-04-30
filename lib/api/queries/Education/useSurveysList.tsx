import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { Survey } from '@/types/entities';

const useSurveysList = ({
	status,
	sort,
	search,
	unpassedOnly,
	showForAll,
	userId,
}: {
	status?: string;
	sort?: string;
	search?: string;
	userId?: string;
	unpassedOnly?: string;
	showForAll?: string;
}) => {
	const api = useApi();

	return useQuery({
		queryKey: ['surveys-list', { status, sort, search, showForAll }],
		queryFn: async (): Promise<Survey[]> => {
			const params = new URLSearchParams({
				...(search && { search }),
				...(sort && { sort }),
				...(status && { status }),
				...(unpassedOnly && { unpassedOnly }),
				...(userId && { userId }),
				...(showForAll && { showForAll }),
			});

			const url = `/surveys?${params.toString()}`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useSurveysList;
