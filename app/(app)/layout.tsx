'use client';

import { useAuth } from '@/components/providers/global/AuthProvider';
import { ReactNode } from 'react';

type InnerLayoutProps = {
	children: ReactNode;
};

export default function InnerLayout({ children }: InnerLayoutProps) {
	const { token } = useAuth();
	if (!token) {
		return null;
	}
	return <>{children}</>;
}
