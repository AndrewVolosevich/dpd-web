'use client';

import { useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { Assessment } from '@/types/assessment';

export function useAllYearAssessments(exportYear?: number) {
	const api = useApi();

	return useQuery<Assessment[]>({
		queryKey: ['all-assessments'],
		queryFn: async () => {
			const response = await api.get(
				`/assessments/get-year-assessments?year=${exportYear?.toString()}`,
			);
			return response.data;
		},
		enabled: !!exportYear,
	});
}
