'use client';

import { useQuery } from '@tanstack/react-query';
import type { UserData } from '@/types/entities';
import useApi from '@/hooks/useApi';

export function useAssessmentUsers() {
	const api = useApi();

	return useQuery<UserData[]>({
		queryKey: ['assessments-users'],
		queryFn: async () => {
			const response = await api.get('/assessments/get-users');
			return response.data;
		},
	});
}
