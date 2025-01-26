import React from 'react';
import SecondaryNewsItem from '@/components/pages/Home/News/SecondaryNewsItem';
import { NewsModel } from '@/types/entities';

type CompanyNewsProps = React.HTMLAttributes<HTMLDivElement> & {
	news: NewsModel[];
};

const CompanyNews = ({ className, news }: CompanyNewsProps) => {
	return (
		<div className={className}>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2">
				{news?.map((i) => <SecondaryNewsItem news={i} key={i.id} />)}
			</div>
		</div>
	);
};

export { CompanyNews };
