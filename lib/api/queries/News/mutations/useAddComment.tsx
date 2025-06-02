'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useAddComment() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (commentData: { content: string; newsId: string }) => {
			return api.post(`/news/comments`, {
				...commentData,
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание комментария',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['news'] });
			queryClient.invalidateQueries({ queryKey: ['news-list'] });
			toast({
				title: 'Комментарий успешно добавлен',
				variant: 'default',
			});
		},
	});
}
