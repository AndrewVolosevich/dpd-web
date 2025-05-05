'use client';

import { useQuery } from '@tanstack/react-query';
import type { Position } from '@/types/structure';
import useApi from '@/hooks/useApi';

export function useDepartmentPositions(departmentId?: string) {
	const api = useApi();

	return useQuery<Position[]>({
		queryKey: ['positions', departmentId],
		queryFn: async () => {
			const response = await api.get(
				`/structure/department-positions/${departmentId}`,
			);
			return response.data;
		},
		enabled: !!departmentId,
	});
}
