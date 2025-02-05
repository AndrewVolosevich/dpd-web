import axios from 'axios';
import { UserData } from '@/types/entities';

export const prefetchUsersByBirthday = async ({
	token,
}: {
	token?: string;
}): Promise<UserData[]> => {
	const api = axios.create({
		baseURL: process.env.NEXT_PUBLIC_SERVER_DOMAIN,
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	});
	const resp = await api.post(`/auth/get-users-by-birthdays`, {
		sortRule: 'bornDate',
	});
	return resp?.data;
};
