'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useFinishMaterial() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (materialId: string) => {
			return api.post(`/education/finish-material/${materialId}`);
		},
		onError: (error) => {
			toast({
				title: 'Неудачная попытка',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['education-cabinet'],
			});
			toast({
				title: 'Вы ознакомились',
				variant: 'default',
			});
		},
	});
}
