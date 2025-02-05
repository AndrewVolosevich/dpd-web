import axios from 'axios';
import { UserData } from '@/types/entities';

export const prefetchNews = async ({
	newsId,
	token,
}: {
	newsId: string;
	token?: string;
}): Promise<UserData[]> => {
	const api = axios.create({
		baseURL: process.env.NEXT_PUBLIC_SERVER_DOMAIN,
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	});
	const resp = await api.get(`/news/${newsId}`);
	return resp?.data;
};
