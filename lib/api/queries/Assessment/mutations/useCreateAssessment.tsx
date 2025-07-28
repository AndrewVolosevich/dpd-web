'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { AssessmentStatus, AssessmentType } from '@/types/assessment';

interface CreateAssessmentData {
	userId: string;
	year: number;
	type: AssessmentType;
	status: AssessmentStatus;
}

export function useCreateAssessment() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (assessmentData: CreateAssessmentData) => {
			const resp = await api.post(`/assessments/create`, { ...assessmentData });
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание оценки',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['assessments-users'],
			});
			toast({
				title: 'Оценка успешно создана',
				variant: 'default',
			});
		},
	});
}
