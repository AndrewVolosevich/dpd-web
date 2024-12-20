import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/styles/globals.css';
import { Header } from '@/components/Header/Header';
import React from 'react';
import { Footer } from '@/components/Footer/Footer';
import { Toaster } from '@/components/ui/toaster';
import './styles/globals.css';
import GlobalProviders from '@/components/providers/global/GlobalProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<GlobalProviders>
					<div className="flex flex-col min-h-screen bg-gray-100">
						<Header />
						<main className={'flex-grow'}>{children}</main>
						<Footer />
						<Toaster />
					</div>
					<Toaster />
				</GlobalProviders>
			</body>
		</html>
	);
}
