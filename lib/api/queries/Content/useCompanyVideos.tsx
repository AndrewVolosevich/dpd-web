import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { CompanyVideo } from '@/types/content';

const useCompanyVideos = () => {
	const api = useApi();

	return useQuery({
		queryKey: ['company-videos'],
		queryFn: async (): Promise<CompanyVideo[]> => {
			const url = `/content/company-videos`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useCompanyVideos;
