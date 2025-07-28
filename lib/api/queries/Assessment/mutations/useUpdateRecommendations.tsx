'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useUpdateRecommendations() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (recommendations: any) => {
			const resp = await api.post(`/assessments/recommendations`, {
				...recommendations,
			});
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное обновление рекомендаций',
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
				title: 'Рекомендации успешно обновлена',
				variant: 'default',
			});
		},
	});
}
