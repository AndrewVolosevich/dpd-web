'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useCompleteAssignment() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (assignmentId?: string) => {
			const response = await api.post(
				`/education/complete-assignment/${assignmentId}`,
			);
			return response.data;
		},
		onSuccess: () => {
			toast({
				title: 'Назначение завершено',
			});
			queryClient.invalidateQueries({ queryKey: ['subordinates-by-position'] });
		},
		onError: () => {
			toast({
				title: 'Ошибка',
				description: 'Не удалось завершить назначение',
				variant: 'destructive',
			});
		},
	});
}
