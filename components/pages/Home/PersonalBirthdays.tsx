'use client';
import React from 'react';
import useUsersByBirthday from '@/lib/api/queries/Users/useUsersByBirthday';
import { groupUsersByBirthday } from '@/lib/date/helpers';
import BirthdaySlider from '@/components/pages/Home/BirthdaySlider';

type PersonalBirthdaysProps = React.HTMLAttributes<HTMLElement>;

const PersonalBirthdays = ({ className }: PersonalBirthdaysProps) => {
	const { data } = useUsersByBirthday();

	const groupedUsers = groupUsersByBirthday(data);
	if (!data?.length) {
		return null;
	}

	return (
		<aside className={className}>
			<h2 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base ml-2">
				Дни Рождения
			</h2>
			<div className="bg-white px-4 py-2 rounded-lg shadow lg:min-h-[calc(100%-40px)] lg:max-h-80 overflow-hidden text-center">
				<BirthdaySlider groupedUsers={groupedUsers} number={data?.length} />
			</div>
		</aside>
	);
};

export { PersonalBirthdays };
