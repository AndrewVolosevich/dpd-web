'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useCreateSurvey() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (surveyData: any) => {
			return api.post(`/surveys`, {
				...surveyData,
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание опроса',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['surveys-list'] });
			toast({
				title: 'Опрос успешно создан',
				variant: 'default',
			});
		},
	});
}
