import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';

const useTemplatesList = () => {
	const api = useApi();

	return useQuery<{ name: string; url: string }[]>({
		queryKey: ['templates'],
		queryFn: async () => {
			const url = `/education/adaptation-templates/`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useTemplatesList;
