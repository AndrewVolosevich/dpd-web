'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useUploadUserPhoto() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (userData: any) => {
			const resp = await api.post(`/upload/update-photo`, userData);
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное изменение фото',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['another-user'],
			});
			await queryClient.invalidateQueries({
				queryKey: ['new-users'],
			});
			await queryClient.invalidateQueries({
				queryKey: ['paginated-users'],
			});
			await queryClient.invalidateQueries({
				queryKey: ['users-by-birthdays'],
			});

			toast({
				title: 'Фото успешно изменено',
				variant: 'default',
			});
		},
	});
}
