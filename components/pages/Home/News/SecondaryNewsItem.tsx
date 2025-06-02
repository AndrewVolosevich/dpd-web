import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NewsModel } from '@/types/entities';
import { cn } from '@/lib/utils';
import { Routes } from '@/const/routes';
import { NewsStatsOverlay } from '@/components/pages/News/NewsStatsOverlay';

type MainNewsProps = React.HTMLAttributes<HTMLDivElement> & {
	news?: NewsModel;
};

const SecondaryNewsItem = ({ className, news }: MainNewsProps) => {
	return (
		<Link href={`${Routes.CORPORATE_LIFE}/news/${news?.id}`}>
			<div
				className={cn(
					'bg-white rounded shadow overflow-hidden h-full',
					className,
				)}
			>
				<div className={'w-full max-h-[200px] min-h-32 relative'}>
					<Image
						src={news?.titleImg || '/images/dpd-image.jpg'}
						fill
						style={{ objectFit: 'cover' }}
						alt={`Secondary news`}
					/>
					<NewsStatsOverlay
						commentsCount={news?.comments?.length || 0}
						likesCount={news?.likes?.length || 0}
						position={'bottom-right'}
					/>
				</div>
				<div
					className={
						'h-full line-clamp-2 px-1 pt-1 bg-gradient-to-r from-primary to-secondary'
					}
				>
					<p className="text-xs text-white">{news?.title}</p>
				</div>
			</div>
		</Link>
	);
};

export default SecondaryNewsItem;
