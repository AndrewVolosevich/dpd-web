'use client';
import React, { PropsWithChildren } from 'react';
import { ThemeProvider } from '@/components/providers/global/ThemeProvider';
import AuthProvider from '@/components/providers/global/AuthProvider';

export function GlobalProviders({ children }: PropsWithChildren) {
	return (
		<>
			<AuthProvider>
				<ThemeProvider>{children}</ThemeProvider>
			</AuthProvider>
		</>
	);
}

export default GlobalProviders;
