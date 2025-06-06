'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { EventPhoto } from '@/types/content';
import { AxiosResponse } from 'axios';

export function useDeleteCompanyVideo() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation<AxiosResponse<EventPhoto>, Error, any>({
		mutationFn: async (id: string) => {
			return api.delete(`/content/company-video/${id}`);
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление видео',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['company-video'],
			});
			queryClient.invalidateQueries({
				queryKey: ['company-videos'],
			});
			toast({
				title: 'Видео успешно удалено',
				variant: 'default',
			});
		},
	});
}
