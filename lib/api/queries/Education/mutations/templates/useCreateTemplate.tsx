'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useCreateTemplate() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (templateData: any) => {
			return api.post(`/education/adaptation-template`, templateData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание шаблона',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['templates'] });
			toast({
				title: 'Шаблон успешно создан',
				variant: 'default',
			});
		},
	});
}
