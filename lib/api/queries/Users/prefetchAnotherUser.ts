import axios from 'axios';
import { UserData } from '@/types/entities';

export const prefetchAnotherUser = async ({
	userId,
	token,
}: {
	userId: string;
	token?: string;
}): Promise<UserData[]> => {
	const api = axios.create({
		baseURL: process.env.NEXT_PUBLIC_SERVER_DOMAIN,
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	});
	const url = userId
		? `/auth/get-another-user?userId=${userId}`
		: '/auth/get-another-user';
	const resp = await api.get(url);
	return resp?.data;
};
