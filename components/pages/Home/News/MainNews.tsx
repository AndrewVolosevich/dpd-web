import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { NewsModel } from '@/types/entities';
import { Routes } from '@/const/routes';

type MainNewsProps = React.HTMLAttributes<HTMLDivElement> & {
	mainNews?: NewsModel;
};

const MainNews = ({ className, mainNews }: MainNewsProps) => {
	return (
		<Link href={`${Routes.NEWS}/${mainNews?.id}`}>
			<div className={cn(className, 'bg-white mb-2 w-full rounded relative')}>
				<div className={'h-72 lg:h-96 w-full relative'}>
					<Image
						layout="fill"
						objectFit="cover"
						src={'/images/dpd-image.jpg'}
						alt={`Главная новость`}
					/>
				</div>
				<div className="text-white absolute bottom-0 left-0 p-4 w-full bg-gradient-to-r from-primary to-secondary">
					<h2 className="font-bold text-sm sm:text-base mb-2 line-clamp-1">
						{mainNews?.title}
					</h2>
					<div className="line-clamp-2 text-sm mb-2">
						{mainNews?.description}
					</div>
				</div>
			</div>
		</Link>
	);
};

export default MainNews;
