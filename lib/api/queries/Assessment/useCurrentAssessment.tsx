'use client';

import { useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { Assessment } from '@/types/assessment';

export function useCurrentAssessment(disabled?: boolean) {
	const api = useApi();

	return useQuery<Assessment>({
		queryKey: ['current-assessment'],
		queryFn: async () => {
			const response = await api.get('/assessments/get-current');
			return response.data;
		},
		enabled: !disabled,
	});
}
