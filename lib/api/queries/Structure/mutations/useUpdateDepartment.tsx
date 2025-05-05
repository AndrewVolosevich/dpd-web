'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { Department } from '@/types/structure';

interface UpdateDepartmentData {
	id: string;
	title: string;
}

export function useUpdateDepartment() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: UpdateDepartmentData): Promise<Department> => {
			const response = await api.patch(`/structure/departments/${data.id}`, {
				title: data.title,
			});
			return response.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное обновление департамента',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['departments'],
			});
			toast({
				title: 'Департамент успешно обновлен',
				variant: 'default',
			});
		},
	});
}
