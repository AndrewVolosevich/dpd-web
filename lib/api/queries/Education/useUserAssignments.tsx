import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { ExtendedAssignment } from '@/types/education';

const useUserAssignments = (userPanelId?: string) => {
	const api = useApi();

	return useQuery<ExtendedAssignment[]>({
		queryKey: ['user-assignments', userPanelId],
		enabled: !!userPanelId,
		queryFn: async () => {
			const url = `/education/user-assignments/${userPanelId}`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useUserAssignments;
