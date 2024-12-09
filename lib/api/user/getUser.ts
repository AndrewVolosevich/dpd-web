import { queryOptions } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';

export const getUserOptions = () => {
	const api = useApi();
	return queryOptions({
		queryKey: ['get-user'],
		queryFn: async () => {
			const response = await api(
				`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/get-user`,
			);

			if (!response?.ok) {
				throw new Error('Network response was not ok');
			}

			return response?.json();
		},
	});
};
