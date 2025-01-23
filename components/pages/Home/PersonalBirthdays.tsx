'use client';
import React from 'react';
import UserCard from '@/components/pages/Home/UserCard';
import useUsersByBirthday from '@/lib/api/queries/Users/useUsersByBirthday';
import { groupUsersByBirthday } from '@/lib/api/date/helpers';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';

type PersonalBirthdaysProps = React.HTMLAttributes<HTMLElement>;

const PersonalBirthdays = ({ className }: PersonalBirthdaysProps) => {
	const { data } = useUsersByBirthday();

	const groupedUsers = groupUsersByBirthday(data);

	if (!data?.length) {
		return null;
	}

	const handleSendEmail = (email: string, name: string) => {
		const subject = encodeURIComponent(`С Днем Рождения, ${name}!`);
		const body = encodeURIComponent(
			`Дорогой(ая) ${name},\n\nПоздравляю тебя с Днем Рождения! Желаю счастья, здоровья и успехов.\n\nС наилучшими пожеланиями.`,
		);
		window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
	};

	return (
		<aside className={className}>
			<h2 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base ml-2">
				Дни Рождения
			</h2>
			<div className="bg-white px-4 py-2 rounded-lg shadow lg:min-h-[calc(100%-40px)] lg:max-h-80 overflow-y-auto">
				<div className="mb-2 sm:mb-4 text-center">
					{Object.entries(groupedUsers).map(([date, users]) => (
						<div key={date}>
							<p className="font-semibold text-sm mb-4">{date}</p>
							<div className="flex flex-row flex-wrap justify-between w-[100%]">
								{users?.map((user) => (
									<div
										key={user.id}
										className={
											'flex flex-row justify-between w-[49%] lg:w-full items-center'
										}
									>
										<UserCard user={user} />
										<Button
											className={'mr-2 mb-4'}
											variant={'outline'}
											onClick={() =>
												handleSendEmail('test@gmail.com', user?.name || '')
											}
										>
											<Gift className={'text-primary'} />
										</Button>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</aside>
	);
};

export { PersonalBirthdays };

// <p className="font-semibold text-sm mb-4">17 марта</p>
// <div className={'flex flex-row flex-wrap justify-between'}>
// 	<UserCard className={'w-[49%] lg:w-full'} user={testUser} />
// 	<UserCard className={'w-[49%] lg:w-full'} user={testUser} />
// 	<UserCard className={'w-[49%] lg:w-full'} user={testUser} />
// 	<UserCard className={'w-[49%] lg:w-full'} user={testUser} />
// </div>
// <p className="font-semibold text-sm mb-4">18 марта</p>
// <UserCard className={'w-[49%] lg:w-full'} user={testUser} />
