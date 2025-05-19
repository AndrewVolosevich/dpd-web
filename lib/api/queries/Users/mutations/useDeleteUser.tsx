'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useDeleteUser() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (userId: string) => {
			return api.delete(`/auth/${userId}`);
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление пользователя',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['paginated-users'] });
			await queryClient.invalidateQueries({
				queryKey: ['department-positions'],
			});
			toast({
				title: 'Пользователь успешно удален',
				variant: 'default',
			});
		},
	});
}
