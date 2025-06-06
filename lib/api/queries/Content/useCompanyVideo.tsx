import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { CompanyVideo } from '@/types/content';

const useCompanyVideo = (id: string) => {
	const api = useApi();

	return useQuery({
		queryKey: ['company-video', id],
		queryFn: async (): Promise<CompanyVideo> => {
			const url = `/content/company-video/${id}`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
		enabled: !!id,
	});
};

export default useCompanyVideo;
