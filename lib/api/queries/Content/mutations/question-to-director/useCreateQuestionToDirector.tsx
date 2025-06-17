'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { QuestionToDirector } from '@/types/content';
import { AxiosResponse } from 'axios';

export function useCreateQuestionToDirector() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation<AxiosResponse<QuestionToDirector>, Error, any>({
		mutationFn: async (dto: any) => {
			return api.post(`/content/director-questions`, {
				...dto,
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание вопроса',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['questions-to-director'],
			});
			queryClient.invalidateQueries({
				queryKey: ['question-to-director'],
			});
			toast({
				title: 'Вопрос успешно создан',
				variant: 'default',
			});
		},
	});
}
