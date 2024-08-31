import React from 'react';
import Image from 'next/image';

type CompanyNewsProps = React.HTMLAttributes<HTMLDivElement>;

const CompanyNews = ({ className }: CompanyNewsProps) => {
	return (
		<div className={className}>
			<h2 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base">
				НОВОСТИ КОМПАНИИ
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="bg-white p-2 sm:p-4 rounded-lg shadow">
						<Image
							src="https://placehold.co/150x200"
							height={150}
							width={200}
							alt={`News ${i}`}
							className="w-full h-24 sm:h-32 object-cover rounded mb-2"
						/>
						<p className="font-semibold text-xs sm:text-sm">17.03, 17 (дата)</p>
						<p className="text-xs sm:text-sm">НАЗВАНИЕ НОВОСТИ</p>
						<p className="text-xs text-gray-600 mt-1 sm:mt-2">
							Краткое содержание новости
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export { CompanyNews };
