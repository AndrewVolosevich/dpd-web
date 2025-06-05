'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { EventPhoto } from '@/types/content';
import { AxiosResponse } from 'axios';

export function useDeleteEventPhoto() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation<AxiosResponse<EventPhoto>, Error, any>({
		mutationFn: async (id: string) => {
			return api.delete(`/content/event-photo/${id}`);
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление фотографий',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['event-photo'],
			});
			toast({
				title: 'Фотографии успешно удалены',
				variant: 'default',
			});
		},
	});
}
