import React from 'react';
import UserCard from '@/components/pages/Home/UserCard';

type PersonalBirsdaysProps = React.HTMLAttributes<HTMLElement>;
const testUser = {
	name: 'Роман',
	surname: 'Петров',
	position: 'Менеджер по продажам',
};

const PersonalBirsdays = ({ className }: PersonalBirsdaysProps) => {
	return (
		<aside className={className}>
			<h2 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base ml-2">
				Дни Рождения
			</h2>
			<div className="bg-white px-4 py-2 rounded-lg shadow lg:min-h-[calc(100%-40px)]">
				<div className="mb-2 sm:mb-4 text-center">
					<p className="font-semibold text-sm mb-4">17 марта</p>
					<div className={'flex flex-row flex-wrap justify-between'}>
						<UserCard className={'w-[49%] lg:w-full'} user={testUser} />
						<UserCard className={'w-[49%] lg:w-full'} user={testUser} />
						<UserCard className={'w-[49%] lg:w-full'} user={testUser} />
						<UserCard className={'w-[49%] lg:w-full'} user={testUser} />
					</div>
					<p className="font-semibold text-sm mb-4">18 марта</p>
					<UserCard className={'w-[49%] lg:w-full'} user={testUser} />
				</div>
			</div>
		</aside>
	);
};

export { PersonalBirsdays };
