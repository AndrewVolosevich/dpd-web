'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useCreateUser() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (userData: any) => {
			const resp = await api.post(`/auth/create-user`, { ...userData });
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание пользователя',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['department-positions'],
			});
			toast({
				title: 'Пользователь успешно создан',
				variant: 'default',
			});
		},
	});
}
