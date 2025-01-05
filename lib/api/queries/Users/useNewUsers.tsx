import { useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { UserData } from '@/types/entities';

const useNewUsers = ({ limit }: { limit: number }) => {
	const api = useApi();

	return useQuery({
		queryKey: ['new-users', { limit }],
		queryFn: async (): Promise<UserData[]> => {
			const resp = await api(
				`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/get-new-users`,
				{
					method: 'POST',
					body: JSON.stringify({ limit }),
				},
			);
			return resp?.json();
		},
	});
};

export default useNewUsers;
