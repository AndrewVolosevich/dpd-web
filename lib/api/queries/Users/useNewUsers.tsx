import { useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { UserData } from '@/types/entities';

const useNewUsers = ({ limit }: { limit: number }) => {
	const api = useApi();

	return useQuery({
		queryKey: ['new-users', { limit }],
		queryFn: async (): Promise<UserData[]> => {
			const resp = await api.post(`/auth/get-new-users`, { limit });
			return resp?.data;
		},
	});
};

export default useNewUsers;
