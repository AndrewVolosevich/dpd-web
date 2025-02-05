import axios from 'axios';
import { UserData } from '@/types/entities';

export const prefetchNewUsers = async ({
	limit,
	token,
}: {
	limit: number;
	token?: string;
}): Promise<UserData[]> => {
	const api = axios.create({
		baseURL: process.env.NEXT_PUBLIC_SERVER_DOMAIN,
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	});
	const resp = await api.post(`/auth/get-new-users`, { limit });
	return resp?.data;
};
