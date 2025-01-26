'use client';
import { useAuth } from '@/components/providers/global/AuthProvider';
import axios from 'axios';

const useApi = () => {
	const { token, refreshToken } = useAuth();

	const api = axios.create({
		baseURL: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}`,
	});

	api.interceptors.request.use(
		(config) => {
			if (!token) {
				return config;
			}
			config.headers.Authorization = `Bearer ${token}`;
			return config;
		},
		(error) => Promise.reject(error),
	);

	api.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config;
			if (error?.response?.status === 401 && !originalRequest?._retry) {
				originalRequest._retry = true;
				try {
					const newToken = await refreshToken();
					originalRequest.headers.Authorization = `Bearer ${newToken}`;
					return api(originalRequest);
				} catch (refreshError) {
					return Promise.reject(refreshError);
				}
			}
			return Promise.reject(error);
		},
	);

	return api;
};

export default useApi;
