'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useAssignSupervisorPanel(departmentId: string) {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (positionId: string) => {
			const response = await api.post(
				`/structure/assign-supervisor-panel/${positionId}`,
			);
			return response.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное назначение панели',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['positions', departmentId],
			});
			toast({
				title: 'Панель успешно назначена',
				variant: 'default',
			});
		},
	});
}
