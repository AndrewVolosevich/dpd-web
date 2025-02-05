import axios from 'axios';
import { UserData } from '@/types/entities';

export const prefetchPaginatedUsers = async ({
	page,
	limit,
	token,
}: {
	page: number;
	limit: number;
	token?: string;
}): Promise<UserData[]> => {
	const api = axios.create({
		baseURL: process.env.NEXT_PUBLIC_SERVER_DOMAIN,
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	});
	const resp = await api.post(`/auth/get-paginated-users`, {
		page,
		limit,
		sortRule: 'surname',
	});
	return resp?.data;
};
