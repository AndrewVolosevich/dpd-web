import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { TrainingCabinet } from '@/types/education';

const useEducationCabinetByTitle = (title: string) => {
	const api = useApi();

	return useQuery({
		queryKey: ['education-cabinet', title],
		queryFn: async (): Promise<TrainingCabinet> => {
			const url = `/education/cabinet/by-title/${title}`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useEducationCabinetByTitle;
