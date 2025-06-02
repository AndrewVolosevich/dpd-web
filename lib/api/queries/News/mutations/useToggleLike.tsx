'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useToggleLike() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (commentData: { newsId: string }) => {
			return api.post(`/news/like`, {
				...commentData,
			});
		},
		onError: (error) => {
			toast({
				title: 'Что-то пошло не так с вашим лайком',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['news'] });
			queryClient.invalidateQueries({ queryKey: ['news-list'] });
			toast({
				title: 'Лайк добавлен',
				variant: 'default',
			});
		},
	});
}
