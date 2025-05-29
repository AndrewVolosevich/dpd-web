'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { TopOfficial } from '@/types/content';
import { AxiosResponse } from 'axios';

export function useDeleteTopOfficial() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation<AxiosResponse<TopOfficial>, Error, any>({
		mutationFn: async (id: string) => {
			return api.delete(`/content/top-official/${id}`);
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление записи',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['top-officials'],
			});
			toast({
				title: 'Запись успешно удалена',
				variant: 'default',
			});
		},
	});
}
