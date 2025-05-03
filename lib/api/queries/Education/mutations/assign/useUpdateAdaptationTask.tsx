'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

// FormData = {
// 	file: file;
// 	planId: file;
// 	comment: string;
// 	userPanelId: string;
// 	dueDate?: Date;
// 	supervisorPositionId?: string;
// }

export function useUpdateAdaptationTask() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (formData: FormData) => {
			const response = await api.post(
				`/education/update-adaptation-task`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data', // Указываем тип контента
					},
				},
			);
			return response.data;
		},
		onSuccess: () => {
			toast({
				title: 'Адаптационный план успешно обновлен',
			});
			queryClient.invalidateQueries({ queryKey: ['subordinates-by-position'] });
		},
		onError: () => {
			toast({
				title: 'Ошибка',
				description: 'Не удалось обновить адаптационный план. ',
				variant: 'destructive',
			});
		},
	});
}
