'use server';
import { cookies } from 'next/headers';
import { ACCESS_TOKEN } from '@/const/common';

export default async function getServerTokenFromCookies() {
	const cookieStore = await cookies();
	const tokenCookie = cookieStore.get(ACCESS_TOKEN);
	return tokenCookie?.value || '';
}
