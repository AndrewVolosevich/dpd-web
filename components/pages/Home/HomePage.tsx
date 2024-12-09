import React from 'react';
import { PersonalChanges } from '@/components/pages/Home/PersonalChanges';
import { PersonalBirsdays } from '@/components/pages/Home/PersonalBirsdays';
import { Slider } from '@/components/pages/Home/Slider';
import { CompanyNews } from '@/components/pages/Home/CompanyNews';

export default function HomePage() {
	return (
		<div className="flex-grow px-2 xl:px-8 py-4 sm:py-8">
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
