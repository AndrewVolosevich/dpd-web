import { useEffect } from 'react';
import { Routes } from '@/const/routes';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/global/AuthProvider';

export const useNonAdminRedirect = (url: Routes | string | undefined) => {
	const router = useRouter();
	const { isAdmin, loading, user } = useAuth();

	useEffect(() => {
		if (user && !isAdmin && !loading) {
			router.push(url ? url : Routes.HOME);
		}
	}, [isAdmin, user, loading, router, url]);

	return;
};
