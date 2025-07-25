import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { TrainingCabinet } from '@/types/education';

const useEducationCabinet = (cabinetId: string) => {
	const api = useApi();

	return useQuery({
		queryKey: ['education-cabinet', cabinetId],
		queryFn: async (): Promise<TrainingCabinet> => {
			const url = `/education/cabinet/${cabinetId}`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useEducationCabinet;
