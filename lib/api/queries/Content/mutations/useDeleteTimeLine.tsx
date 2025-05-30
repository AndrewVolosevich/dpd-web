'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { TimeLine } from '@/types/content';
import { AxiosResponse } from 'axios';

export function useDeleteTimeLine() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation<AxiosResponse<TimeLine>, Error, any>({
		mutationFn: async (year: number) => {
			return api.delete(`/content/time-line/${year.toString()}`);
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление года',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['time-line'],
			});
			toast({
				title: 'Год успешно удален',
				variant: 'default',
			});
		},
	});
}
