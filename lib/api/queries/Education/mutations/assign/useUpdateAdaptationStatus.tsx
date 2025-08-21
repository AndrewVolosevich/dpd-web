'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useUpdateAdaptationStatus() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await api.post(
				`/education/update-adaptation-task-info`,
				data,
			);
			return response.data;
		},
		onSuccess: () => {
			toast({
				title: 'Статус успешно обновлен',
			});
			queryClient.invalidateQueries({ queryKey: ['subordinates-by-position'] });
		},
		onError: () => {
			toast({
				title: 'Ошибка',
				description: 'Не удалось обновить статус. ',
				variant: 'destructive',
			});
		},
	});
}
