'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useUpdateSurvey() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (surveyData: any) => {
			return api.put(`/surveys/${surveyData.id}`, {
				...surveyData,
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное редактирование опроса',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['surveys-list'] });
			queryClient.invalidateQueries({ queryKey: ['survey'] });
			toast({
				title: 'Опрос успешно обновлен',
				variant: 'default',
			});
		},
	});
}
