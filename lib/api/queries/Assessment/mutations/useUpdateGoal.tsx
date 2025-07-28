'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useUpdateGoal() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (goalData: any) => {
			const resp = await api.put(`/assessments/goal/update`, { ...goalData });
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное редактирование цели',
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
				title: 'Цель успешно обновлена',
				variant: 'default',
			});
		},
	});
}
