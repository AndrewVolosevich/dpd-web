'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useCreateMastery() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (competencyData: any) => {
			const resp = await api.post(`/assessments/mastery/create`, {
				...competencyData,
			});
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное редактирование уровня',
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
				title: 'Уровень успешно обновлен',
				variant: 'default',
			});
		},
	});
}
