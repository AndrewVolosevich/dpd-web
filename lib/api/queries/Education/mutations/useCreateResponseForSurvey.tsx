'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { Answer } from '@/types/entities';

export function useCreateResponseForSurvey() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (responseData: {
			surveyId: string;
			userId: string;
			answers: Answer[];
		}) => {
			return api.post(`/surveys/response`, {
				...responseData,
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное прохождение опроса',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['surveys-list'] });
			toast({
				title: 'Опрос успешно пройден',
				variant: 'default',
			});
		},
	});
}
