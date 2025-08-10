'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useDeleteThanksTo() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			return api.delete(`/content/thanks-to/${id}`);
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление благодарности',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['thanks-to'],
			});
			toast({
				title: 'Благодарность успешно удалена',
				variant: 'default',
			});
		},
	});
}
