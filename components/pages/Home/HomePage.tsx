'use client';

import React, { useCallback } from 'react';
import { PersonalChanges } from '@/components/pages/Home/PersonalChanges';
import { PersonalBirsdays } from '@/components/pages/Home/PersonalBirsdays';
import { Slider } from '@/components/pages/Home/Slider';
import { CompanyNews } from '@/components/pages/Home/CompanyNews';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { Button } from '@/components/ui/button';

export default function HomePage() {
	const { token, refreshToken } = useAuth();
	const handleGetUser = async () => {
		const resp = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/get-user`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			},
		);

		console.log(await resp.json());
	};

	const handleRefresh = () => {
		refreshToken();
	};
	return (
		<div className="flex-grow px-2 xl:px-8 py-4 sm:py-8">
			<Button onClick={handleGetUser}>get user</Button>
			<Button onClick={handleRefresh}>refresh</Button>
			<div className="flex flex-col lg:flex-row gap-4">
				<PersonalChanges className="lg:w-1/5 order-2 lg:order-1" />
				<div className="lg:w-3/5 order-1 lg:order-2">
					<Slider />
					<CompanyNews />
				</div>
				<PersonalBirsdays className="lg:w-1/5 order-3" />
			</div>
		</div>
	);
}
