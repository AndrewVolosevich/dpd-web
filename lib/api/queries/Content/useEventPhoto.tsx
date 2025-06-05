import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { EventPhoto } from '@/types/content';

const useEventPhoto = () => {
	const api = useApi();

	return useQuery({
		queryKey: ['event-photo'],
		queryFn: async (): Promise<EventPhoto[]> => {
			const url = `/content/event-photos`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useEventPhoto;
