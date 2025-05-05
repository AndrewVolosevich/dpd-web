'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useDeleteNews() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (newsId: any) => {
			return api(`/news/${newsId}`, {
				method: 'DELETE',
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление новости',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['news'] });
			queryClient.invalidateQueries({ queryKey: ['news-list'] });
			toast({
				title: 'Новость успешно удалена',
				variant: 'default',
			});
		},
	});
}
