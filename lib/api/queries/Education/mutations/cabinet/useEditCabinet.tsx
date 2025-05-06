'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useEditCabinet() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			formData,
			cabinetId,
		}: {
			formData: FormData;
			cabinetId: string;
		}) => {
			return api.post(`/education/update-cabinet/${cabinetId}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data', // Указываем тип контента
				},
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное обновление кабинета',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['education-cabinets-list'],
			});
			toast({
				title: 'Кабинет успешно обновлен',
				variant: 'default',
			});
		},
	});
}
