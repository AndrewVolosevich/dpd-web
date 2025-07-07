'use client';
import React, { useState } from 'react';
import { PersonalBirthdays } from '@/components/pages/Home/PersonalBirthdays';
import { PersonalChanges } from '@/components/pages/Home/PersonalChanges';
import HomePageNews from '@/components/pages/Home/News/HomePageNews';
import ActiveSurveys from '@/components/pages/Home/ActiveSurveys';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { ContextButton, ContextIcons } from '@/components/ui/context-button';
import MoodSurveyModal from '@/components/pages/Home/MoodSurveyModal';

export const HomePage = () => {
	const { token } = useAuth();
	const [moodModalOpen, setMoodModalOpen] = useState(false);

	if (!token) {
		return null;
	}

	return (
		<div className="flex flex-col justify-center w-full py-4">
			<div className={'flex container mx-auto gap-6 flex-col lg:flex-row mb-4'}>
				<div className="lg:w-8/12">
					<HomePageNews />
				</div>
				<PersonalBirthdays className="w-full lg:w-4/12" />
			</div>
			<ActiveSurveys />
			<PersonalChanges className={'w-full mt-4 container mx-auto'} />
			<>
				<ContextButton
					tooltip="Опрос настроения"
					onClick={() => setMoodModalOpen(true)}
					iconVariant={ContextIcons.MOOD}
				/>
				<MoodSurveyModal open={moodModalOpen} onOpenChange={setMoodModalOpen} />
			</>
		</div>
	);
};
