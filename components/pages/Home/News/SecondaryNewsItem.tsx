import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NewsModel } from '@/types/entities';
import { cn } from '@/lib/utils';
import { Routes } from '@/const/routes';

type MainNewsProps = React.HTMLAttributes<HTMLDivElement> & {
	mainNews?: NewsModel;
};

const SecondaryNewsItem = ({ className, mainNews }: MainNewsProps) => {
	return (
		<Link href={`${Routes.NEWS}/${mainNews?.id}`}>
			<div
				className={cn(
					'bg-white rounded shadow overflow-hidden h-full',
					className,
				)}
			>
				<div className={'w-full max-h-[200px] min-h-32 relative'}>
					<Image
						src="/images/dpd-image.jpg"
						layout="fill"
						objectFit="cover"
						alt={`Secondary news`}
					/>
				</div>
				<div
					className={
						'h-full line-clamp-2 px-1 pt-1 bg-gradient-to-r from-primary to-secondary'
					}
				>
					<p className="text-xs text-white">{mainNews?.title}</p>
				</div>
			</div>
		</Link>
	);
};

export default SecondaryNewsItem;
