'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useDeleteTemplate() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (url: string) => {
			return api.delete(`/education/template`, { data: { url: url } });
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление шаблона',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['templates'] });
			toast({
				title: 'Шаблон успешно удален',
				variant: 'default',
			});
		},
	});
}
