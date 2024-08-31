import React from 'react';
import Image from 'next/image';

type PersonalChangesProps = React.HTMLAttributes<HTMLElement>;

const PersonalChanges = ({ className }: PersonalChangesProps) => {
	return (
		<aside className={className}>
			<div className="bg-white p-2 rounded-lg shadow min-h-full">
				<h2 className="font-bold mb-4 text-sm sm:text-base text-center">
					Кадровые изменения
				</h2>
				{[1, 2].map((i) => (
					<div key={i} className="flex items-center mb-4">
						<Image
							src="https://placehold.co/50x50"
							height={50}
							width={50}
							alt={`Employee ${i}`}
							className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-1 sm:mr-2"
						/>
						<div>
							<p className="font-semibold text-sm">ФИО</p>
							<p className="text-xs sm:text-sm text-gray-600">
								Подразделение, должность
							</p>
						</div>
					</div>
				))}
			</div>
		</aside>
	);
};

export { PersonalChanges };
