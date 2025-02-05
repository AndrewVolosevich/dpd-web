'use client';
import { useAuth } from '@/components/providers/global/AuthProvider';
import axios from 'axios';
import { useMemo } from 'react';

const useApi = () => {
	const { token, refreshToken } = useAuth();

	return useMemo(() => {
		const instance = axios.create({
			baseURL: process.env.NEXT_PUBLIC_SERVER_DOMAIN,
		});

		instance.interceptors.request.use(
			(config) => {
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error),
		);

		instance.interceptors.response.use(
			(response) => response,
			async (error) => {
				const originalRequest = error.config;
				if (error?.response?.status === 401 && !originalRequest?._retry) {
					originalRequest._retry = true;
					try {
						const newToken = await refreshToken();
						originalRequest.headers.Authorization = `Bearer ${newToken}`;
						return instance(originalRequest);
					} catch (refreshError) {
						return Promise.reject(refreshError);
					}
				}
				return Promise.reject(error);
			},
		);

		return instance;
	}, [token, refreshToken]);
};

export default useApi;
