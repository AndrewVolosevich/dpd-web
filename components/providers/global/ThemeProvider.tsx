'use client';

import * as React from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export enum ThemeVariants {
	Light = 'light',
	Dark = 'dark',
}

export function ThemeProvider({ children }: ThemeProviderProps) {
	return (
		<NextThemeProvider
			attribute="class"
			defaultTheme={ThemeVariants.Light}
			disableTransitionOnChange
		>
			{children}
		</NextThemeProvider>
	);
}
