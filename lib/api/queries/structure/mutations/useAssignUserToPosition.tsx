'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

interface AssignUserData {
	positionId?: string;
	userId: string;
}

export function useAssignUserToPosition() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: AssignUserData) => {
			const response = await api.post(`/structure/assign-user-to-position`, {
				userId: data.userId,
				positionId: data?.positionId,
			});
			return response.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное назначение пользователя',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ['positions', data?.position?.departmentId],
			});
			toast({
				title: 'Пользователь успешно назначен',
				variant: 'default',
			});
		},
	});
}
