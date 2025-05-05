'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useDeleteMaterial() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (materialId: string) => {
			return api.delete(`/education/material/${materialId}`);
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление материала',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['education-cabinet'],
			});
			toast({
				title: 'Материал успешно удален',
				variant: 'default',
			});
		},
	});
}
