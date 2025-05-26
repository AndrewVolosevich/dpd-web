import { QueryFunction, QueryKey, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

export function useLazyQuery<
	TQueryFnData = unknown,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
>(queryFn: QueryFunction<TQueryFnData, TQueryKey>) {
	const queryClient = useQueryClient();

	const [data, setData] = useState<TData>();
	const [isLoading, setIsLoading] = useState(false);

	const trigger = useCallback(
		async (queryKey: TQueryKey) => {
			setIsLoading(true);

			return await queryClient
				.ensureQueryData({ queryKey, queryFn })
				.then((res) => {
					setData(res as unknown as TData);
					setIsLoading(false);

					return res;
				});
		},
		[queryClient, queryFn],
	);

	const result = useMemo(
		() => ({
			trigger,
			isLoading,
			data,
		}),
		[data, isLoading, trigger],
	);

	return result;
}
