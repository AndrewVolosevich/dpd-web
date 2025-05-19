'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

interface UpdatePositionData {
	id: string;
	title: string;
}

export function useUpdatePosition() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: UpdatePositionData) => {
			const response = await api.patch(`/structure/positions/${data.id}`, {
				title: data.title,
			});
			return response.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное обновление должности',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ['department-positions', data?.departmentId],
			});
			toast({
				title: 'Должность успешно обновленна',
				variant: 'default',
			});
		},
	});
}
