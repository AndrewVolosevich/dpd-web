import { useAuth } from '@/components/providers/global/AuthProvider';

const useApi = () => {
	const { token, refreshToken, logout } = useAuth();

	return async (url: string, options: RequestInit = {}) => {
		if (!token) {
			return {
				ok: false,
				statusText: 'Unauthorized: No token',
				data: null,
			};
		}

		const fetchOptions: RequestInit = {
			...options,
			headers: {
				...options.headers,
				'Content-Type': 'application/json',
				Accept: 'application/json',
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

		if (!response.ok) {
			throw new Error(response?.statusText);
		}

		return response;
	};
};

export default useApi;
