import React from 'react';
import MainNews from '@/components/pages/Home/News/MainNews';
import SecondaryNews from '@/components/pages/Home/News/SecondaryNews';

type CompanyNewsProps = React.HTMLAttributes<HTMLDivElement>;

const CompanyNews = ({ className }: CompanyNewsProps) => {
	return (
		<div className={className}>
			<h2 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base ml-2">
				Новости компании
			</h2>
			<MainNews />
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2">
				{[1, 2, 3, 4].map((i) => (
					<SecondaryNews key={i} />
				))}
			</div>
		</div>
	);
};

export { CompanyNews };
