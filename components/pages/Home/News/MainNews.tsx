import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type MainNewsProps = React.HTMLAttributes<HTMLDivElement> & {
	url?: string;
};

const MainNews = ({ className, url }: MainNewsProps) => {
	return (
		<div className={cn(className, 'bg-white mb-2 w-full rounded relative')}>
			<div className={'h-72 lg:h-96 w-full relative'}>
				<Image
					layout="fill"
					objectFit="cover"
					src={url || 'https://placehold.co/800x400'}
					alt={`Главная новость`}
				/>
			</div>
			<div className="text-white absolute bottom-0 left-0 p-4">
				<h2 className="font-bold text-sm sm:text-base mb-2">
					Новогодний конкурс &#34;битва елок&#34;
				</h2>
				<div className="line-clamp-2 text-sm mb-2">
					Привет дорогие коллеги. Это будет длинный текст. Это будет длинный
					текст. Это будет длинный текст. Это будет длинный текст.
				</div>
				<Link className={'hover:text-red-600'} href={'/'}>
					Читать &gt;&gt;
				</Link>
			</div>
		</div>
	);
};

export default MainNews;
