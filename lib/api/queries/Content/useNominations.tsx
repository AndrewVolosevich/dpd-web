import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { Nomination } from '@/types/content';

const useNominations = () => {
	const api = useApi();

	return useQuery({
		queryKey: ['nominations'],
		queryFn: async (): Promise<Nomination[]> => {
			const url = `/content/nominations`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useNominations;
