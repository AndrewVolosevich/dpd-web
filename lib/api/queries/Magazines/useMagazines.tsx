import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { MagazinesData } from '@/types/entities';

const useMagazines = () => {
	const api = useApi();

	return useQuery({
		queryKey: ['magazines'],
		queryFn: async (): Promise<MagazinesData> => {
			const url = `/content/magazines`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useMagazines;
