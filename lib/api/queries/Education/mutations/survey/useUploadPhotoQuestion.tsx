'use client';

import { useMutation } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useUploadPhotoQuestion() {
	const { toast } = useToast();
	const api = useApi();

	return useMutation({
		mutationFn: async (formData: FormData) => {
			const resp = await api.post(`/upload/add-survey-photo`, formData);
			return resp.data;
		},
		onError: (error) => {
			toast({
				title: 'Ошибка загрузки фото',
				variant: 'destructive',
				description: error.message,
			});
		},
	});
}
