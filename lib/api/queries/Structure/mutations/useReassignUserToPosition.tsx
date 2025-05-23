'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

interface RessignUserData {
	currentPositionId: string;
	newPositionId: string;
}

export function useReassignUserToPosition() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: RessignUserData) => {
			const response = await api.post(`/structure/reassign-user-to-position`, {
				currentPositionId: data.currentPositionId,
				newPositionId: data.newPositionId,
			});
			return response.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное переназначение пользователя',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['department-positions'],
			});
			queryClient.invalidateQueries({
				queryKey: ['users'],
			});
			toast({
				title: 'Пользователь успешно переназначен',
				variant: 'default',
			});
		},
	});
}
