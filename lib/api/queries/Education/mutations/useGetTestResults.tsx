'use client';

import { useMutation } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useGetTestResults() {
	const { toast } = useToast();
	const api = useApi();
	return useMutation({
		mutationFn: async (params: { surveyId: string; userId: string }) => {
			return api.get(`/surveys/${params.surveyId}/results`);
		},
		onError: (error) => {
			toast({
				title: 'Ошибка при получении результатов',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			toast({
				title: 'Результаты успешно получены',
				variant: 'default',
			});
		},
	});
}
