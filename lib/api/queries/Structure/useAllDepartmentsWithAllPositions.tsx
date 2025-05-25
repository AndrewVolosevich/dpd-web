'use client';

import { useQuery } from '@tanstack/react-query';
import type { Position } from '@/types/structure';
import useApi from '@/hooks/useApi';

export function useAllDepartmentWithAllPositions() {
	const api = useApi();

	return useQuery<Position[]>({
		queryKey: ['department-positions-all'],
		queryFn: async () => {
			const response = await api.get(`/structure/departments-with-positions`);
			return response.data;
		},
	});
}
