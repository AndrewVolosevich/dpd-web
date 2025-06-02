'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useDeleteComment() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (commentId: string) => {
			return api.delete(`/news/comments/${commentId}`);
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление комментария',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['news'] });
			queryClient.invalidateQueries({ queryKey: ['news-list'] });
			toast({
				title: 'Комментарий успешно удален',
				variant: 'default',
			});
		},
	});
}
