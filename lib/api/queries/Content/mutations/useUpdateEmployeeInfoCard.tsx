'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useUpdateEmployeeInfoCard() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			formData,
		}: {
			id: string;
			formData: FormData;
		}) => {
			return api.post(`/content/employee-info-card/${id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['employee-info-card'],
			});
			toast({
				title: 'Запись успешно создана',
				variant: 'default',
			});
		},
	});
}
