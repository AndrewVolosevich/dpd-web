'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useAddCompanyVideo() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (formData: FormData) => {
			return api.post(`/content/company-video`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное добавление видео',
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
				title: 'Видео успешно добавлено',
				variant: 'default',
			});
		},
	});
}
