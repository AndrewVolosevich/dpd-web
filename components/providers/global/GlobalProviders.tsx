'use client';
import React, { PropsWithChildren } from 'react';
import { ThemeProvider } from '@/components/providers/global/ThemeProvider';
import AuthProvider from '@/components/providers/global/AuthProvider';
import QueryProvider from '@/components/providers/global/QueryProvider';

export function GlobalProviders({ children }: PropsWithChildren) {
	return (
		<>
			<AuthProvider>
				<QueryProvider>
					<ThemeProvider>{children}</ThemeProvider>
				</QueryProvider>
			</AuthProvider>
		</>
	);
}

export default GlobalProviders;
