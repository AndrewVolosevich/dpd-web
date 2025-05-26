'use client';
import React from 'react';
import MainNews from '@/components/pages/Home/News/MainNews';
import { CompanyNews } from '@/components/pages/Home/News/CompanyNews';
import useNewsList from '@/lib/api/queries/News/useNewsList';
import { cn } from '@/lib/utils';

type CompanyNewsProps = React.HTMLAttributes<HTMLDivElement>;

const HomePageNews = ({ className }: CompanyNewsProps) => {
	const { data } = useNewsList({ page: 1, limit: 4 });

	return (
		<div className={cn(className)}>
			<h2 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base ml-2">
				Новости компании
			</h2>
			<MainNews mainNews={data?.main} />
			<CompanyNews news={data?.data} />
		</div>
	);
};

export default HomePageNews;
