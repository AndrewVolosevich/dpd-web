'use client';

import { useMutation } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useDeletePhotoQuestion() {
	const { toast } = useToast();
	const api = useApi();

	return useMutation({
		mutationFn: async (url: string) => {
			const resp = await api.post(`/upload/deleteByUrl`, { url: url });
			return resp.data;
		},
		onError: (error) => {
			toast({
				title: 'Ошибка удаления фото',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			toast({
				title: 'Фото успешно удалено',
				variant: 'default',
			});
		},
	});
}
