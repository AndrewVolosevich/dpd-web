import React from 'react';

type PersonalBirsdaysProps = React.HTMLAttributes<HTMLElement>;

const PersonalBirsdays = ({ className }: PersonalBirsdaysProps) => {
	return (
		<aside className={className}>
			<div className="bg-white p-2 rounded-lg shadow min-h-full">
				<h2 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base text-center">
					Дни Рождения
				</h2>
				<div className="mb-2 sm:mb-4 text-center">
					<p className="font-semibold text-sm">17 марта</p>
					<p className="text-sm">Роман Петров</p>
					<p className="text-xs sm:text-sm text-gray-600 mb-2">
						Подразделение 1
					</p>

					<p className="text-sm">Петр Романов</p>
					<p className="text-xs sm:text-sm text-gray-600 mb-4">
						Подразделение 2
					</p>

					<p className="font-semibold text-sm">18 марта</p>
					<p className="text-sm">Семен Иванов</p>
					<p className="text-xs sm:text-sm text-gray-600">Подразделение 1</p>
				</div>
			</div>
		</aside>
	);
};

export { PersonalBirsdays };
