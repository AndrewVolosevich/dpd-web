'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useCreateCabinet() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (cabinetData: any) => {
			return api.post(`/education/cabinet`, {
				...cabinetData,
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание кабинета',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['education-cabinets-list'],
			});
			toast({
				title: 'Кабинет успешно создан',
				variant: 'default',
			});
		},
	});
}
