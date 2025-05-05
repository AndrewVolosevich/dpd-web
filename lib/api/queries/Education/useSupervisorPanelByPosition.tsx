import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { ExtendedUserData } from '@/types/entities';

const useSupervisorPanelByPosition = (positionId: string) => {
	const api = useApi();

	return useQuery<ExtendedUserData[]>({
		queryKey: ['subordinates-by-position', positionId],
		queryFn: async () => {
			const url = `/structure/department-subordinates/${positionId}`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useSupervisorPanelByPosition;
