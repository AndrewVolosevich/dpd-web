'use client';

import { useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { Assessment } from '@/types/assessment';

export function useAssessment(id?: string) {
	const api = useApi();

	return useQuery<Assessment>({
		queryKey: ['assessment', id],
		queryFn: async () => {
			const response = await api.get(`/assessments/get-assessment/${id}`);
			return response.data;
		},
		enabled: !!id,
	});
}
