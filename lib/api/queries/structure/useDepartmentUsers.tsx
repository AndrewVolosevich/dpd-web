'use client';

import { useQuery } from '@tanstack/react-query';
import type { Position } from '@/types/structure';
import useApi from '@/hooks/useApi';

export function useDepartmentPositions(departmentId: string) {
	const api = useApi();

	return useQuery<Position[]>({
		queryKey: ['department-users', departmentId],
		queryFn: async () => {
			const response = await api.get(`/department-users/${departmentId}`);
			return response.data;
		},
		enabled: !!departmentId,
	});
}
