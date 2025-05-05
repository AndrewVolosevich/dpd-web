'use client';

import { useMutation } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useUploadImage(url: string) {
	const { toast } = useToast();
	const api = useApi();

	return useMutation({
		mutationFn: async (userData: FormData) => {
			const resp = await api.post(url, userData);
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное изменение изображения',
				variant: 'destructive',
				description: error.message,
			});
		},
	});
}
