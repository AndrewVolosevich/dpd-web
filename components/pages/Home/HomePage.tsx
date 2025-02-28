'use client';
import React from 'react';
import { PersonalBirthdays } from '@/components/pages/Home/PersonalBirthdays';
import { PersonalChanges } from '@/components/pages/Home/PersonalChanges';
import HomePageNews from '@/components/pages/Home/News/HomePageNews';
import ActiveSurveys from '@/components/pages/Home/ActiveSurveys';

export const HomePage = () => {
	return (
		<div className="flex flex-col justify-center w-full py-4">
			<div className={'flex container mx-auto gap-6 flex-col lg:flex-row mb-4'}>
				<div className="lg:w-8/12">
					<HomePageNews />
				</div>
				<PersonalBirthdays className="w-full lg:w-4/12" />
			</div>
			<PersonalChanges className={'w-full mt-4 container mx-auto'} />
			<ActiveSurveys />
		</div>
	);
};
