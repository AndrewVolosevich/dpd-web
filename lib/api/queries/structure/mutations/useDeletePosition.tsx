'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useDeletePosition() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (positionId: string) => {
			const response = await api.delete(`/structure/positions/${positionId}`);
			return response.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление должности',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ['positions', data?.departmentId],
			});
			toast({
				title: 'Должность успешно удалена',
				variant: 'default',
			});
		},
	});
}
