'use client';

import React, {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { Routes } from '@/const/routes';
import { useRouter } from 'next/navigation';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/const/common';
import { useToast } from '@/hooks/use-toast';

export interface LoginProps {
	tel: string;
	password: string;
}

export interface AuthUser {
	tel: string;
	id: string;
	name: string;
	roles?: string[];
}

interface AuthContextInterface {
	loading: boolean;
	user: AuthUser | null;
	token: string;
	login: (_: LoginProps) => void;
	refresh: () => void;
	logout: () => void;
}

const AuthContext = createContext({
	loading: false,
	user: null,
	token: '',
	login: async () => undefined,
	logout: async () => undefined,
	refresh: async () => undefined,
} as AuthContextInterface);

export function useAuth() {
	return useContext(AuthContext);
}

const AuthProvider = ({ children }: PropsWithChildren) => {
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);
	const [token, setToken] = useState<string>('');
	const [user, setUser] = useState<AuthUser | null>(null);
	const { toast } = useToast();

	console.log('===AuthProvider!', user, token);

	const clearUserData = () => {
		setToken('');
		setUser(null);
		localStorage.setItem(REFRESH_TOKEN, '');
		localStorage.setItem(ACCESS_TOKEN, '');
	};

	const login = useCallback(
		async (credentials: LoginProps) => {
			setLoading(true);
			let resp = null;
			if (credentials) {
				resp = await fetch(`/api/auth/sign-in/`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ ...credentials }),
				});
			}

			if (!resp?.ok) {
				toast({
					title: 'Ошибка',
					description: 'при входе',
					variant: 'destructive',
				});
				return;
			}
			const responseData = await resp?.json();
			const { accessToken, refreshToken, user } = responseData || {};
			setToken(accessToken);
			setUser(user);
			localStorage.setItem('user', JSON.stringify(user));
			localStorage.setItem(REFRESH_TOKEN, refreshToken);
			localStorage.setItem(ACCESS_TOKEN, accessToken);
			setLoading(false);
			router.push(Routes.HOME);
		},
		[router],
	);

	const logout = useCallback(async () => {
		setLoading(true);
		await fetch(`/api/auth/sign-out`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token: 'remove' }),
		});
		clearUserData();
		localStorage.setItem('user', '');
		setLoading(false);
		router.push(Routes.SIGN_IN);
	}, [router]);

	const refresh = useCallback(async () => {
		if (!user?.id) {
			setLoading(true);
			const resp = await fetch(`/api/auth/refresh-user`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (resp.ok) {
				const user = await resp.json();
				if (user?.id) {
					setUser(user);
					localStorage.setItem('user', JSON.stringify(user));
					if (localStorage.getItem(ACCESS_TOKEN)) {
						setToken(localStorage.getItem(ACCESS_TOKEN) || '');
					}
					setLoading(false);
					router.refresh();
				} else {
					await logout();
				}
			} else {
				await logout();
			}
			setLoading(false);
		}
	}, [logout, toast]);

	useEffect(() => {
		if (
			typeof window !== 'undefined' &&
			!!localStorage.getItem(REFRESH_TOKEN)
		) {
			refresh();
		}
	}, []);

	const contextValue = useMemo(
		() => ({
			loading,
			user,
			token,
			login,
			logout,
			refresh,
		}),
		[loading, user, token, login, logout, refresh],
	);
	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

export default AuthProvider;
