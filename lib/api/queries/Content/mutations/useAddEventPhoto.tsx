'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useAddEventPhoto() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (formData: FormData) => {
			return api.post(`/content/event-photo`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data', // Указываем тип контента
				},
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное добавление фото',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['event-photo'],
			});
			toast({
				title: 'Фото успешно добавлены',
				variant: 'default',
			});
		},
	});
}
