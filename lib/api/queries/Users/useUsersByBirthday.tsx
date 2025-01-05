import { useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { UserData } from '@/types/entities';

const useUsersByBirthday = () => {
	const api = useApi();

	return useQuery({
		queryKey: ['users-by-birthdays'],
		queryFn: async (): Promise<UserData[]> => {
			const resp = await api.post(`/auth/get-users-by-birthdays`, {
				sortRule: 'bornDate',
			});
			return resp?.data;
		},
	});
};

export default useUsersByBirthday;
