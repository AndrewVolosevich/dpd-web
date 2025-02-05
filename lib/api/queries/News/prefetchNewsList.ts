import axios from 'axios';

export const prefetchNewsList = async ({
	page,
	limit,
	dateRange,
	token,
}: {
	page: number;
	limit: number;
	dateRange?: { from?: Date; to?: Date };
	token?: string;
}): Promise<any> => {
	const api = axios.create({
		baseURL: process.env.NEXT_PUBLIC_SERVER_DOMAIN,
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	});
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
		...(dateRange?.from && { from: dateRange.from.toISOString() }),
		...(dateRange?.to && { to: dateRange.to.toISOString() }),
	});

	const url = `/news/paginated?${params.toString()}`;
	const resp = await api.get(url);
	return resp.data;
};
