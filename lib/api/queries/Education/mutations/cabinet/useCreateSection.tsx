'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useCreateSection() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (sectionData: any) => {
			return api.post(`/education/section`, {
				...sectionData,
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание секции',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['education-cabinet'],
			});
			toast({
				title: 'Секция успешно создана',
				variant: 'default',
			});
		},
	});
}
