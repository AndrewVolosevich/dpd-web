import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { ContentPage } from '@/types/content';

const useEducationCabinetsList = (pageContentTitle?: string) => {
	const api = useApi();

	return useQuery({
		queryKey: ['content-page', pageContentTitle],
		queryFn: async (): Promise<ContentPage> => {
			const url = `/content/content-page/${pageContentTitle}`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
		enabled: !!pageContentTitle,
	});
};

export default useEducationCabinetsList;
