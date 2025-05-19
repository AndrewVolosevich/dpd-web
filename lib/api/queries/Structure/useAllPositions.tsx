'use client';

import { useQuery } from '@tanstack/react-query';
import type { Position } from '@/types/structure';
import useApi from '@/hooks/useApi';

export function useAllPositions() {
	const api = useApi();

	return useQuery<Position[]>({
		queryKey: ['all-positions'],
		queryFn: async () => {
			const response = await api.get(`/structure/positions`);
			return response.data;
		},
	});
}
