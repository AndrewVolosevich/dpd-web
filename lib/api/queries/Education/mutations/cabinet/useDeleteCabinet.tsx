'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useDeleteCabinet() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (cabinetData: any) => {
			return api.delete(`/education/cabinet/${cabinetData.id}`, {
				...cabinetData,
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление кабинета',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['education-cabinets-list'],
			});
			toast({
				title: 'Кабинет успешно удален',
				variant: 'default',
			});
		},
	});
}
