import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { ThanksTo } from '@/types/content';

const useNominations = () => {
	const api = useApi();

	return useQuery({
		queryKey: ['thanks-to'],
		queryFn: async (): Promise<ThanksTo[]> => {
			const url = `/content/thanks-to`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useNominations;
