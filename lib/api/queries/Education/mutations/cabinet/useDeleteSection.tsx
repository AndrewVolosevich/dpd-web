'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useDeleteSection() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (sectionId: any) => {
			return api.delete(`/education/section/${sectionId}`);
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление секции',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['education-cabinet'],
			});
			toast({
				title: 'Секция успешно удалена',
				variant: 'default',
			});
		},
	});
}
