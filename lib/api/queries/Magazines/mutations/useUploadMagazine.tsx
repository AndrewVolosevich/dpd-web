'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useUploadMagazine() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: any) => {
			const resp = await api.post(`/upload/magazine`, data);
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачная загрузка журнала',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['magazines'],
			});
			toast({
				title: 'Журнал успешно загружен',
				variant: 'default',
			});
		},
	});
}
