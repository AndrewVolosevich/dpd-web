import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { QuestionToDirector } from '@/types/content';

const useQuestionToDirector = (id: string) => {
	const api = useApi();

	return useQuery({
		queryKey: ['question-to-director'],
		queryFn: async (): Promise<QuestionToDirector> => {
			const url = `/content/director-question/${id}`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
		enabled: !!id,
	});
};

export default useQuestionToDirector;
