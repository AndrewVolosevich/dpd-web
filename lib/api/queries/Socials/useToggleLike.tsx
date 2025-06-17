'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export function useToggleLike() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (commentData: {
			newsId?: string;
			questionToDirectorId?: string;
			isLike?: boolean;
		}) => {
			return api.post(`/socials/like`, {
				...commentData,
			});
		},
		onError: (error) => {
			toast({
				title: 'Что-то пошло не так с вашим лайком',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: (resp) => {
			if (resp.data?.questionToDirectorId) {
				queryClient.invalidateQueries({
					queryKey: ['questions-to-director'],
				});
				queryClient.invalidateQueries({
					queryKey: ['question-to-director'],
				});
			}
			if (resp.data?.newsId) {
				queryClient.invalidateQueries({ queryKey: ['news'] });
				queryClient.invalidateQueries({ queryKey: ['news-list'] });
			}

			toast({
				title: 'Лайк добавлен',
				variant: 'default',
			});
		},
	});
}
