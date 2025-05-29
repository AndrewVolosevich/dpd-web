'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useCreateTopOfficial() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (formData: FormData) => {
			return api.post(`/content/top-official`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['top-officials'],
			});
			toast({
				title: 'Запись успешно создана',
				variant: 'default',
			});
		},
	});
}
