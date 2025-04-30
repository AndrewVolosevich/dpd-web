'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useCreateNews() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (newsData: any) => {
			return api.post(`/news/create`, {
				...newsData,
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание новости',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['news'] });
			queryClient.invalidateQueries({ queryKey: ['news-list'] });
			toast({
				title: 'Новость успешно создана',
				variant: 'default',
			});
		},
	});
}
