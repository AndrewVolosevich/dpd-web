'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useUpdateUser() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (userData: any) => {
			const resp = await api.post(`/auth/update-user`, { ...userData });
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное изменение пользователя',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['new-users'],
			});
			await queryClient.invalidateQueries({
				queryKey: ['another-user'],
			});
			await queryClient.invalidateQueries({
				queryKey: ['paginated-users'],
			});
			await queryClient.invalidateQueries({
				queryKey: ['users-by-birthdays'],
			});
			await queryClient.invalidateQueries({
				queryKey: ['department-positions'],
			});

			toast({
				title: 'Пользователь успешно изменен',
				variant: 'default',
			});
		},
	});
}
