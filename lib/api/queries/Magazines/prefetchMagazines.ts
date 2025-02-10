import axios from 'axios';
import { UserData } from '@/types/entities';

export const prefetchMagazines = async ({
	token,
}: {
	token?: string;
}): Promise<UserData[]> => {
	const api = axios.create({
		baseURL: process.env.NEXT_PUBLIC_SERVER_DOMAIN,
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	});
	const resp = await api.get(`/content/magazines`);
	return resp?.data;
};
