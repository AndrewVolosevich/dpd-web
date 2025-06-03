import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { EmployeeInfoCard } from '@/types/content';

const useEmployeeInfoCard = (isTop?: boolean) => {
	const api = useApi();

	return useQuery({
		queryKey: ['employee-info-card'],
		queryFn: async (): Promise<EmployeeInfoCard[]> => {
			const url = `/content/employee-info-card/${isTop ? 'isTop' : 'isEmployee'}`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useEmployeeInfoCard;
