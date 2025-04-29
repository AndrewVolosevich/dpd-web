import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { Assignment } from '@/types/education';

const useUserMaterialAssignments = (userPanelId?: string) => {
	const api = useApi();

	return useQuery<Assignment[]>({
		queryKey: ['user-material-assignments', userPanelId],
		enabled: !!userPanelId,
		queryFn: async () => {
			const url = `/education/user-material-assignments/${userPanelId}`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useUserMaterialAssignments;
