import { useAuth } from '@/components/providers/global/AuthProvider';

const useApi = () => {
	const { token, refreshToken, logout } = useAuth();

	return async (url: string, options: RequestInit = {}) => {
		const fetchOptions: RequestInit = {
			...options,
			headers: {
				...options.headers,
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};

		let response = await fetch(url, fetchOptions);
		if (response.status === 401) {
			// Try to refresh
			try {
				const newToken = await refreshToken();

				fetchOptions.headers = {
					...fetchOptions.headers,
					Authorization: `Bearer ${newToken}`,
				};
				response = await fetch(url, fetchOptions);
			} catch (error) {
				logout();
			}
		}

		return response;
	};
};

export default useApi;
