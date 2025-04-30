import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { ExtendedAssignment } from '@/types/education';

const useUserMaterialAssignments = (userPanelId?: string) => {
	const api = useApi();

	return useQuery<ExtendedAssignment[]>({
		queryKey: ['user-material-assignments', userPanelId],
		enabled: !!userPanelId,
		queryFn: async () => {
			const url = `/education/user-material-assignments/${userPanelId}`;
			const resp = await api.get(url);
			console.log('===resp?.data', resp?.data);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useUserMaterialAssignments;
