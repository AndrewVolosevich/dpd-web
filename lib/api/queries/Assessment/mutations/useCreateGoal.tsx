'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useCreateGoal() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (goalData: any) => {
			const resp = await api.post(`/assessments/goal/create`, { ...goalData });
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание цели',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['assessment'],
			});
			await queryClient.invalidateQueries({
				queryKey: ['current-assessment'],
			});
			toast({
				title: 'Цель успешно создана',
				variant: 'default',
			});
		},
	});
}
