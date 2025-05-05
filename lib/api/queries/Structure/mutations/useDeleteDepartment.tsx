'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useDeleteDepartment() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (departmentId: string) => {
			const response = await api.delete(
				`/structure/departments/${departmentId}`,
			);
			return response.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление департамента',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['departments'],
			});
			toast({
				title: 'Департамент успешно удален',
				variant: 'default',
			});
		},
	});
}
