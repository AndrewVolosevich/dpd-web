import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { NewsModel } from '@/types/entities';
import { Routes } from '@/const/routes';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

type MainNewsProps = React.HTMLAttributes<HTMLDivElement> & {
	mainNews?: NewsModel;
};

const MainNews = ({ className, mainNews }: MainNewsProps) => {
	return (
		<div className={cn(className, 'bg-white mb-2 w-full rounded relative')}>
			<Link href={`${Routes.NEWS}`}>
				<Button
					type={'button'}
					variant={'default'}
					className={'absolute top-2 right-2 z-10'}
				>
					<Eye className={'mr-2'} />
					Все новости
				</Button>
			</Link>
			<Link href={`${Routes.NEWS}/${mainNews?.id}`}>
				<div className={'h-72 lg:h-96 w-full relative'}>
					<Image
						fill
						style={{ objectFit: 'cover' }}
						src={mainNews?.titleImg || '/images/dpd-image.jpg'}
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
			</Link>
		</div>
	);
};

export default MainNews;
