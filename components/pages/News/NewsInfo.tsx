'use client';
import React from 'react';
import OutputBlock from '@/components/Editor/OutputBlock';
import { NewsModel } from '@/types/entities';

interface NewsInfoProps extends React.HTMLAttributes<HTMLDivElement> {
	news: NewsModel;
}

const NewsInfo = ({ news, className, ...props }: NewsInfoProps) => {
	return (
		<div className={className} {...props}>
			<h3 className={'text-2xl text-primary uppercase'}>{news.title}</h3>
			<h4 className={'text-xl'}>{news.description}</h4>
			{news?.content && <OutputBlock content={news.content} />}
		</div>
	);
};

export default NewsInfo;
