'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useDeleteAssignment() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (assignmentId?: string) => {
			const response = await api.delete(
				`/education/delete-assignment/${assignmentId}`,
			);
			return response.data;
		},
		onSuccess: () => {
			toast({
				title: 'Назначение удалено',
			});
			queryClient.invalidateQueries({ queryKey: ['subordinates-by-position'] });
		},
		onError: () => {
			toast({
				title: 'Ошибка',
				description: 'Не удалось удалить назначение',
				variant: 'destructive',
			});
		},
	});
}
