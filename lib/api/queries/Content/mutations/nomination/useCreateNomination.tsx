'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export interface CreateNominationDto {
	title: string;
	description?: string;
	nominantsIds: string[];
}

export function useCreateNomination() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateNominationDto) => {
			return api.post(`/content/nomination`, data);
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание номинации',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['nominations'],
			});
			toast({
				title: 'Номинация успешно создана',
				variant: 'default',
			});
		},
	});
}
