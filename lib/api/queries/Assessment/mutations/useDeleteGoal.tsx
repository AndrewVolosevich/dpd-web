'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useDeleteGoal() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: any) => {
			const resp = await api.delete(`/assessments/goal/${id}`);
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление цели',
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
				title: 'Цель успешно удалена',
				variant: 'default',
			});
		},
	});
}
