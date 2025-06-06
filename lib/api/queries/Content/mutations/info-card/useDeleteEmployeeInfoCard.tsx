'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { AxiosResponse } from 'axios';
import { EmployeeInfoCard } from '@/types/content';

export function useDeleteEmployeeInfoCard() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation<AxiosResponse<EmployeeInfoCard>, Error, any>({
		mutationFn: async (id: string) => {
			return api.delete(`/content/employee-info-card/${id}`);
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление записи',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['employee-info-card'],
			});
			toast({
				title: 'Запись успешно удалена',
				variant: 'default',
			});
		},
	});
}
