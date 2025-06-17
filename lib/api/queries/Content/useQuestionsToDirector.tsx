import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { QuestionToDirector } from '@/types/content';

const useQuestionsToDirector = () => {
	const api = useApi();

	return useQuery({
		queryKey: ['questions-to-director'],
		queryFn: async (): Promise<QuestionToDirector[]> => {
			const url = `/content/director-questions`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useQuestionsToDirector;
