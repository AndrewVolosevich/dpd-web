import React from 'react';
import PersonalSlider from '@/components/pages/Home/PersonalSlider';

type PersonalChangesProps = React.HTMLAttributes<HTMLElement>;

const PersonalChanges = ({ className }: PersonalChangesProps) => {
	return (
		<aside className={className}>
			<h2 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base ml-2">
				Новые сотрудники
			</h2>
			<div className="bg-white p-4 rounded-lg shadow min-h-full">
				<PersonalSlider />
			</div>
		</aside>
	);
};

export { PersonalChanges };
