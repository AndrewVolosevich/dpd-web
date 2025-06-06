'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { ContentPage } from '@/types/content';
import { AxiosResponse } from 'axios';

export function useCreateContentPage() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation<AxiosResponse<ContentPage>, Error, any>({
		mutationFn: async (contentPageData: ContentPage) => {
			return api.post(`/content/content-page`, {
				...contentPageData,
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание страницы',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: (resp) => {
			queryClient.invalidateQueries({
				queryKey: ['content-page', resp?.data?.pageTitle],
			});
			toast({
				title: 'Страница успешно создана',
				variant: 'default',
			});
		},
	});
}
