'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useMoodVote() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (option: number) => {
			return api.post(`/surveys/mood-vote`, {
				option,
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное голосование',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['mood-statistic'] });
			toast({
				title: 'Вы успешно проголосовали',
				variant: 'default',
			});
		},
	});
}
