'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

interface CreatePositionData {
	title: string;
	departmentId: string;
}

export function useCreatePosition() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreatePositionData) => {
			const response = await api.post('/structure/position', data);
			return response.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание должности',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ['department-positions', data?.departmentId],
			});
			toast({
				title: 'Должность успешно создана',
				variant: 'default',
			});
		},
	});
}
