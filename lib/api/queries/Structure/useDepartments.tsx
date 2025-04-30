'use client';

import { useQuery } from '@tanstack/react-query';
import type { Department } from '@/types/structure';
import useApi from '@/hooks/useApi';

export function useDepartments() {
	const api = useApi();

	return useQuery<Department[]>({
		queryKey: ['departments'],
		queryFn: async () => {
			const response = await api.get('/structure/departments');
			return response.data;
		},
	});
}
