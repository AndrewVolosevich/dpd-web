'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useDeleteMagazine() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (magazineId: any) => {
			return api(`/content/magazines/${magazineId}`, {
				method: 'DELETE',
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление журнала',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['magazines'] });
			toast({
				title: 'Журнал успешно удален',
				variant: 'default',
			});
		},
	});
}
