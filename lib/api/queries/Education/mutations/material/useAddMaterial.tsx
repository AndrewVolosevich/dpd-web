'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useAddMaterial() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (formData: FormData) => {
			return api.post(`/education/upload-material`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data', // Указываем тип контента
				},
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное добавление материала',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['education-cabinet'],
			});
			toast({
				title: 'Материал успешно добавлен',
				variant: 'default',
			});
		},
	});
}
