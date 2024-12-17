import React from 'react';
import { PersonalBirsdays } from '@/components/pages/Home/PersonalBirsdays';
import { CompanyNews } from '@/components/pages/Home/News/CompanyNews';
import { PersonalChanges } from '@/components/pages/Home/PersonalChanges';

export default function HomePage() {
	return (
		<div className="flex flex-col justify-center w-full py-4">
			<div className={'flex container mx-auto gap-6 flex-col lg:flex-row'}>
				<div className="lg:w-8/12">
					<CompanyNews />
				</div>
				<PersonalBirsdays className="w-full lg:w-4/12" />
			</div>
			<PersonalChanges className={'w-full mt-4 container mx-auto'} />
		</div>
	);
}
