import { useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { UserData } from '@/types/entities';

const useUsersByBirthday = () => {
	const api = useApi();

	return useQuery({
		queryKey: ['users-by-birthdays'],
		queryFn: async (): Promise<UserData[]> => {
			const resp = await api(
				`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/get-users-by-birthdays`,
				{
					method: 'POST',
					body: JSON.stringify({ sortRule: 'bornDate' }),
				},
			);
			return resp?.json();
		},
	});
};

export default useUsersByBirthday;
