'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useDeleteNomination() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			return api.delete(`/content/nomination/${id}`);
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление номинации',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['nominations'],
			});
			toast({
				title: 'Номинация успешно удалена',
				variant: 'default',
			});
		},
	});
}
