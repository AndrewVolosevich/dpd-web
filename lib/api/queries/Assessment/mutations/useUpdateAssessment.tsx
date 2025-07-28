'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { AssessmentStatus, AssessmentType } from '@/types/assessment';

interface UpdateAssessmentData {
	userId?: string;
	id: string;
	year?: number;
	type?: AssessmentType;
	status?: AssessmentStatus;
}

export function useUpdateAssessment() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (assessmentData: UpdateAssessmentData) => {
			const resp = await api.put(`/assessments/update`, { ...assessmentData });
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное обновление оценки',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['assessments-users'],
			});
			await queryClient.invalidateQueries({
				queryKey: ['assessment'],
			});
			await queryClient.invalidateQueries({
				queryKey: ['current-assessment'],
			});
			toast({
				title: 'Оценка успешно обновлена',
				variant: 'default',
			});
		},
	});
}
