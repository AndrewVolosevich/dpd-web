'use client';

import { useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { UserData } from '@/types/entities';

export function useSubordinateUserAssessments(enabled: boolean) {
	const api = useApi();

	return useQuery<UserData[]>({
		queryKey: ['subordinate-assessments'],
		queryFn: async () => {
			const response = await api.get('/assessments/get-subordinate');
			return response.data;
		},
		enabled,
	});
}
