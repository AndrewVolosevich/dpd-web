'use client';
import React, { Suspense } from 'react';
import { PersonalBirthdays } from '@/components/pages/Home/PersonalBirthdays';
import { PersonalChanges } from '@/components/pages/Home/PersonalChanges';
import HomePageNews from '@/components/pages/Home/News/HomePageNews';
import FullPageLoader from '@/components/common/Loader/FullPageLoader';

export default function HomePage() {
	return (
		<div className="flex flex-col justify-center w-full py-4">
			<div className={'flex container mx-auto gap-6 flex-col lg:flex-row mb-4'}>
				<div className="lg:w-8/12">
					<Suspense fallback={<FullPageLoader />}>
						<HomePageNews />
					</Suspense>
				</div>
				<PersonalBirthdays className="w-full lg:w-4/12" />
			</div>
			<PersonalChanges className={'w-full mt-4 container mx-auto'} />
		</div>
	);
}
