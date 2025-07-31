'use client';
import React, { useState } from 'react';
import { PersonalBirthdays } from '@/components/pages/Home/PersonalBirthdays';
import { PersonalChanges } from '@/components/pages/Home/PersonalChanges';
import HomePageNews from '@/components/pages/Home/News/HomePageNews';
import ActiveSurveys from '@/components/pages/Home/ActiveSurveys';
import { useAuth } from '@/components/providers/global/AuthProvider';
import MoodSurveyModal from '@/components/pages/Home/MoodSurveyModal';
import { Activity } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

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
				<TooltipProvider delayDuration={200}>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="fixed bottom-24 right-24 rounded-full ">
								<button
									className="bg-white rounded-full border-2 border-primary relative group text-primary w-28 h-28 flex items-center justify-center text-6xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 hover:rotate-6"
									onClick={() => setMoodModalOpen(true)}
								>
									<span className="group-hover:scale-110 transition-transform duration-500 w-[60%] h-[60%]">
										<Activity className={'w-[100%] h-[100%]'} />
									</span>
									{/* Концентрические круги */}
									<div className="absolute inset-2 rounded-full border-2 border-primary opacity-30 animate-ping-slow"></div>
									<div className="absolute inset-4 rounded-full border-2 border-primary opacity-20 animate-ping-slower"></div>
								</button>
							</div>
						</TooltipTrigger>
						<TooltipContent
							collisionPadding={20}
							sideOffset={10}
							className={'bg-white border-2 border-primary text-primary'}
						>
							<p>Опрос настроения</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<MoodSurveyModal open={moodModalOpen} onOpenChange={setMoodModalOpen} />
			</>
		</div>
	);
};
