'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { AssessmentStatus, AssessmentType } from '@/types/assessment';

interface BulkAssessmentData {
	year: number;
	type: AssessmentType;
	status: AssessmentStatus;
	userIds: string[];
	startDate?: Date;
	dueDate?: Date;
}

export function useBulkAssessment() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (assessmentData: BulkAssessmentData) => {
			const resp = await api.post(`/assessments/bulk-upsert`, {
				...assessmentData,
			});
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное обновление оценок',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['assessments-users'],
			});
			toast({
				title: 'Оценки успешно обновлены',
				variant: 'default',
			});
		},
	});
}
