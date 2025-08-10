'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useUpdateThanksTo() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (formData: FormData) => {
			return api.post(`/content/update-thanks-to`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data', // Указываем тип контента
				},
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное обновление благодарности',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['thanks-to'],
			});
			toast({
				title: 'Благодарность успешно обновлена',
				variant: 'default',
			});
		},
	});
}
