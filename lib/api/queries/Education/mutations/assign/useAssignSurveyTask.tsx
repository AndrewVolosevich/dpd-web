'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useAssignSurveyTaskToUser() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: {
			surveyIds: string[];
			userPanelId: string;
			dueDate?: Date;
			supervisorPositionId: string;
		}) => {
			const response = await api.post(`/education/assign-survey-task`, {
				userPanelId: data.userPanelId, // ID панели пользователя
				surveyIds: data.surveyIds, // IDs теста/опроса
				dueDate: data?.dueDate, // Крайний срок выполнения
				supervisorPositionId: data.supervisorPositionId, // ID панели руководителя
			});
			return response.data;
		},
		onSuccess: () => {
			toast({
				title: 'Опросы успешно назначены',
			});
			queryClient.invalidateQueries({ queryKey: ['subordinates-by-position'] });
		},
		onError: () => {
			toast({
				title: 'Ошибка',
				description: 'Не удалось назначить опросы. ',
				variant: 'destructive',
			});
		},
	});
}
