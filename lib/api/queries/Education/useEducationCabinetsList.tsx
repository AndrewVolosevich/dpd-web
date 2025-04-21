import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { TrainingCabinet } from '@/types/education';

const useEducationCabinetsList = () => {
	const api = useApi();

	return useQuery({
		queryKey: ['education-cabinets-list'],
		queryFn: async (): Promise<TrainingCabinet[]> => {
			const url = `/education/cabinets`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useEducationCabinetsList;
