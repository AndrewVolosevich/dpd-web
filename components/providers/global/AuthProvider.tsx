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
import { usePathname, useRouter } from 'next/navigation';
import { ACCESS_TOKEN, REFRESH_TOKEN, USER } from '@/const/common';
import { useToast } from '@/hooks/use-toast';

export interface LoginProps {
	tel: string;
	password: string;
}

export interface AuthUser {
	tel: string;
	id: string;
	name: string;
	surname: string;
	patronymic?: string;

	roles?: string[];
	department?: string;
	positionId?: string;
	photo?: string;
	userPanelId?: string;
	endDate?: string;
	startDate?: string;
	bornDate?: string;
	createdAt: string;
	updatedAt?: string;
}

interface AuthContextInterface {
	loading: boolean;
	user: AuthUser | null;
	updateUser: (u: AuthUser) => void;
	isAdmin?: boolean;
	isSupervisor?: boolean;
	token: string;
	login: (_: LoginProps) => void;
	refreshToken: () => Promise<string | undefined>;
	logout: () => void;
}

const AuthContext = createContext({
	loading: true,
	user: null,
	updateUser: () => undefined,
	isAdmin: false,
	isSupervisor: false,
	token: '',
	login: async () => undefined,
	logout: async () => undefined,
	refreshToken: async () => undefined,
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

	const isAdmin = useMemo(() => {
		return user?.roles?.some((r) => r === 'ADMIN');
	}, [user]);
	const isSupervisor = useMemo(() => {
		return user?.roles?.some((r) => r === 'SUPERVISOR');
	}, [user]);

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
				setLoading(false);
				return;
			}
			const responseData = await resp?.json();
			const { accessToken, refreshToken, user } = responseData || {};
			setToken(accessToken);
			setUser(user);
			localStorage.setItem(USER, JSON.stringify(user));
			localStorage.setItem(REFRESH_TOKEN, refreshToken);
			localStorage.setItem(ACCESS_TOKEN, accessToken);
			setLoading(false);
			router.refresh();
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
		localStorage.setItem(USER, '');
		setLoading(false);
		router.push(Routes.SIGN_IN);
	}, [router]);

	const refreshUser = useCallback(async () => {
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
					localStorage.setItem(USER, JSON.stringify(user));
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

	const refreshToken = useCallback(async () => {
		setLoading(true);
		const resp = await fetch(`/api/auth/refresh-token`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (!resp?.ok) {
			toast({
				title: 'Ошибка',
				description: 'при рефреше',
				variant: 'destructive',
			});
			await logout();
			setLoading(false);
			return;
		}
		const responseData = await resp?.json();
		const { accessToken, refreshToken, user } = responseData || {};
		setToken(accessToken);
		setUser(user);
		localStorage.setItem(USER, JSON.stringify(user));
		localStorage.setItem(REFRESH_TOKEN, refreshToken);
		localStorage.setItem(ACCESS_TOKEN, accessToken);
		setLoading(false);
		return accessToken;
	}, [toast]);

	const updateUser = useCallback(
		async (user: AuthUser) => {
			setLoading(true);
			let resp = null;
			if (user) {
				resp = await fetch(`/api/auth/update-user/`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ user }),
				});
			}

			if (!resp?.ok) {
				setLoading(false);
				return;
			}

			setUser(user);
			localStorage.setItem(USER, JSON.stringify(user));
			setLoading(false);
			router.refresh();
		},
		[router],
	);
	const pathname = usePathname();

	useEffect(() => {
		const checkPage = async () => {
			try {
				const response = await fetch(pathname);
				if (response.status === 404) {
					return;
				} else {
					refreshUser();
				}
			} catch {
				//
			}
		};
		if (
			typeof window !== 'undefined' &&
			!!localStorage.getItem(REFRESH_TOKEN)
		) {
			const localToken = localStorage.getItem(ACCESS_TOKEN);
			if (!token && localToken) {
				setToken(localToken);
			}
			const localUser = localStorage.getItem(USER);
			if (!localUser) {
				checkPage();
			} else if (localUser) {
				setUser(JSON.parse(localUser));
			}
		}
	}, []);

	const contextValue = useMemo(
		() => ({
			loading,
			user,
			isAdmin,
			isSupervisor,
			token,
			login,
			logout,
			refreshToken,
			updateUser,
		}),
		[
			loading,
			user,
			isAdmin,
			token,
			login,
			logout,
			refreshToken,
			updateUser,
			isSupervisor,
		],
	);
	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

export default AuthProvider;
