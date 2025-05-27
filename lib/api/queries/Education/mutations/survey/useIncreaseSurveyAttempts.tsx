'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { UserResponseForSurvey } from '@/types/entities';
import { AxiosResponse } from 'axios';

export function useIncreaseSurveyAttempts() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();
	return useMutation<AxiosResponse<UserResponseForSurvey>, Error, any>({
		mutationFn: async (responseData: { surveyId: string; userId: string }) => {
			return api.post(`/surveys/response/increase-attempts`, {
				...responseData,
			});
		},
		onError: (error) => {
			toast({
				title: 'Что-то пошло не так',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['surveys-list'] });
			queryClient.invalidateQueries({ queryKey: ['user-assignments'] });
			toast({
				title: 'Вы не уложились по времени',
				variant: 'default',
			});
		},
	});
}
