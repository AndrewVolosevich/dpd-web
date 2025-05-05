'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useAssignMaterialTask() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: {
			materialIds: string[];
			userPanelId: string;
			dueDate?: Date;
			supervisorPositionId: string;
		}) => {
			const response = await api.post(`/education/assign-material-task`, {
				userPanelId: data.userPanelId, // ID панели пользователя
				materialIds: data.materialIds, // ID материала
				dueDate: data?.dueDate, // Крайний срок выполнения
				supervisorPositionId: data.supervisorPositionId, // ID панели руководителя
			});
			return response.data;
		},
		onSuccess: () => {
			toast({
				title: 'Материалы успешно назначены',
			});
			queryClient.invalidateQueries({ queryKey: ['subordinates-by-position'] });
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
