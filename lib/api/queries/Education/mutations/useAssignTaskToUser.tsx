'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useAssignTaskToUser() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: {
			materialIds?: string[];
			surveyIds?: string[];
			userPanelId: string;
			dueDate?: Date;
			supervisorPositionId?: string;
		}) => {
			const response = await api.post(`/education/assign-task`, {
				userPanelId: data.userPanelId, // ID панели пользователя
				surveyIds: data?.surveyIds, // ID теста/опроса (если назначается)
				materialIds: data?.materialIds, // ID материала (если назначается)
				dueDate: data?.dueDate, // Крайний срок выполнения
				supervisorPositionId: data?.supervisorPositionId, // ID панели руководителя
			});
			return response.data;
		},
		onSuccess: () => {
			toast({
				title: 'Материалы назначены',
				description: `Материалы успешно назначены`,
			});
			queryClient.invalidateQueries({ queryKey: ['user-panel'] });
		},
		onError: () => {
			toast({
				title: 'Ошибка',
				description: 'Не удалось назначить материалы. ',
				variant: 'destructive',
			});
		},
	});
}
