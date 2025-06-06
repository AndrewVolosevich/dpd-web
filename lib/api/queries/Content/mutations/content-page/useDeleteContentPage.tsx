'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { ContentPage } from '@/types/content';
import { AxiosResponse } from 'axios';

export function useDeleteContentPage(contentPageTitle: string) {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation<AxiosResponse<ContentPage>, Error, any>({
		mutationFn: async () => {
			return api.delete(`/content/${contentPageTitle}`);
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление страницы',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['content-page', contentPageTitle],
			});
			toast({
				title: 'Страница успешно удалена',
				variant: 'default',
			});
		},
	});
}
