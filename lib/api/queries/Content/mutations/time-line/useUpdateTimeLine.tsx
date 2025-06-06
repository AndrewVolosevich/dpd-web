'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { TimeLine } from '@/types/content';
import { AxiosResponse } from 'axios';

export function useUpdateTimeLine() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation<AxiosResponse<TimeLine>, Error, any>({
		mutationFn: async ({
			timeLineData,
			year,
		}: {
			timeLineData: TimeLine;
			year: number;
		}) => {
			return api.post(`/content/time-line/update/${year.toString()}`, {
				...timeLineData,
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное обновление года',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['time-line'],
			});
			toast({
				title: 'Год успешно обновлен',
				variant: 'default',
			});
		},
	});
}
