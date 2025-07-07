import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';

type MoodStatisticResponse = {
	votedUsers: { userId: string; option: number }[];
	votesPerOption: Record<1 | 2 | 3 | 4 | 5, number>;
	hasVoted: boolean;
	totalVotes: number;
};

const useMoodStatistic = () => {
	const api = useApi();

	return useQuery({
		queryKey: ['mood-statistic'],
		queryFn: async (): Promise<MoodStatisticResponse> => {
			const url = `/surveys/mood-statistics`;
			const resp = await api.get(url);
			return resp?.data;
		},
		placeholderData: keepPreviousData,
	});
};

export default useMoodStatistic;
