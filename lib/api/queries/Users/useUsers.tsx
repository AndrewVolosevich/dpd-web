'use client';

import { useQuery } from '@tanstack/react-query';
import type { UserData } from '@/types/entities';
import useApi from '@/hooks/useApi';

export function useUsers() {
	const api = useApi();

	return useQuery<UserData[]>({
		queryKey: ['users'],
		queryFn: async () => {
			const response = await api.post('/auth/get-users', {
				sortRule: 'surname',
			});
			return response.data;
		},
	});
}
