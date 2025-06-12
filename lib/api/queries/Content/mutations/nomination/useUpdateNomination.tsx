'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export interface UpdateNominationDto {
	id: string;
	title: string;
	description?: string;
	nominantsIds: string[];
}

export function useUpdateNomination() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: UpdateNominationDto) => {
			return api.post(`/content/nomination-update`, data);
		},
		onError: (error) => {
			toast({
				title: 'Неудачное изменение номинации',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['nominations'],
			});
			toast({
				title: 'Номинация успешно обновлена',
				variant: 'default',
			});
		},
	});
}
