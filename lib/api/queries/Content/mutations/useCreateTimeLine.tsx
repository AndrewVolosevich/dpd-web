'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { TimeLine } from '@/types/content';
import { AxiosResponse } from 'axios';

export function useCreateTimeLine() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation<AxiosResponse<TimeLine>, Error, any>({
		mutationFn: async (timeLineData: TimeLine) => {
			return api.post(`/content/time-line`, {
				...timeLineData,
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание года',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['time-line'],
			});
			toast({
				title: 'Год успешно создан',
				variant: 'default',
			});
		},
	});
}
