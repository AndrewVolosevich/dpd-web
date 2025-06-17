'use client';
import React from 'react';
import OutputBlock from '@/components/Editor/OutputBlock';
import { NewsModel } from '@/types/entities';
import CommentsSection from '@/components/pages/News/CommentsSection';
import { LikeButton } from '@/components/pages/News/LikeButton';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { useToggleLike } from '@/lib/api/queries/Socials/useToggleLike';

interface NewsInfoProps extends React.HTMLAttributes<HTMLDivElement> {
	news: NewsModel;
}

const NewsInfo = ({ news, className, ...props }: NewsInfoProps) => {
	const { user } = useAuth();
	const { mutate: toggleLike, isPending: toggleLikeLoading } = useToggleLike();

	return (
		<div className={className} {...props}>
			<h3 className={'text-2xl text-primary uppercase'}>{news.title}</h3>
			<h4 className={'text-xl'}>{news.description}</h4>
			{news?.content && <OutputBlock content={news.content} />}
			{user && (
				<LikeButton
					initialLikesCount={news?.likes?.length || 0}
					initialIsLiked={
						news.likes?.some((like) => like.userId === user?.id) || false
					}
					onToggleLike={() => {
						toggleLike({ newsId: news.id, isLike: true });
					}}
					disabled={toggleLikeLoading}
				/>
			)}
			{news && <CommentsSection data={news} dataType={'news'} />}
		</div>
	);
};

export default NewsInfo;
