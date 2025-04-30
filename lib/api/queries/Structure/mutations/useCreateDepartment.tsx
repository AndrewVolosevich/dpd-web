'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { Department } from '@/types/structure';

interface CreateDepartmentData {
	title: string;
	parentId?: string | null;
}

export function useCreateDepartment() {
	const { toast } = useToast();
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateDepartmentData): Promise<Department[]> => {
			const response = await api.post('/structure/department', data);
			return response.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание департамента',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['departments'],
			});
			toast({
				title: 'Департамент успешно создан',
				variant: 'default',
			});
		},
	});
}
