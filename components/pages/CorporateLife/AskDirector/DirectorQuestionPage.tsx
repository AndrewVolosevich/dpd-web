'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Routes } from '@/const/routes';
import useQuestionToDirector from '@/lib/api/queries/Content/useQuestionToDirector';
import { getDislikesCount, getLikesCount, getStatusBadge } from '@/lib/socials';
import { useToggleLike } from '@/lib/api/queries/Socials/useToggleLike';
import FullPageLoader from '@/components/common/Loader/FullPageLoader';
import CommentsSection, {
	CommentData,
} from '@/components/pages/News/CommentsSection';

export default function DirectorQuestionPage({ id }: { id: string }) {
	const { data: question, isLoading } = useQuestionToDirector(id);
	const { mutate: like, isPending: likeLoading } = useToggleLike();

	const handleVote = (type: 'like' | 'dislike') => {
		like({ questionToDirectorId: id, isLike: type === 'like' });
	};

	const getInitials = (name?: string, surname?: string) => {
		return `${name?.charAt(0)}${surname?.charAt(0)}`.toUpperCase();
	};

	if (isLoading) {
		return <FullPageLoader />;
	}

	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			<Breadcrumb>
				<BreadcrumbList className="p-0 list-none">
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Главная</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href={`${Routes.CORPORATE_LIFE}/magazines`}>
							Корпоративная жизнь
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink
							href={`${Routes.CORPORATE_LIFE}/question-to-director`}
						>
							Список вопросов директору
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Вопрос директору</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<h1 className="text-3xl font-bold">Детали вопроса</h1>

			<div className="max-w-4xl mx-auto px-6 py-8">
				{/* Question Card */}
				{question && (
					<Card className="border-0 shadow-lg mb-8">
						<CardHeader>
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-start gap-4 flex-1">
									<Avatar className="w-16 h-16">
										<AvatarImage
											src={question?.user?.photo || '/placeholder.svg'}
										/>
										<AvatarFallback className="bg-red-100 text-red-600 text-lg">
											{getInitials(
												question?.user?.name,
												question?.user?.surname,
											)}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<h3 className="font-medium text-gray-900">
												{question?.user?.surname} {question?.user?.name}
											</h3>
											<span className="text-sm text-gray-500">•</span>
											<span className="text-sm text-gray-500">
												{question?.user?.position?.title}
											</span>
											<span className="text-sm text-gray-500">•</span>
										</div>
										<CardTitle className="text-xl mb-2">
											{question?.title}
										</CardTitle>
										<div className="flex items-center gap-2">
											<Badge variant="outline">{question?.category}</Badge>
											{getStatusBadge(question?.status)}
										</div>
									</div>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-gray-700 mb-6 leading-relaxed">
								{question?.description}
							</p>

							{/* Voting */}
							<div className="flex items-center justify-between border-t pt-4">
								<div className="flex items-center gap-4">
									<Button
										variant={'ghost'}
										size="lg"
										onClick={() => handleVote('like')}
										className={
											'text-green-600 hover:text-green-700 hover:bg-green-50 py-8 text-2xl'
										}
									>
										<ThumbsUp className="w-12 h-12 mr-4" />
										{getLikesCount(question?.likes)}
									</Button>
									<Button
										variant={'ghost'}
										size="lg"
										onClick={() => handleVote('dislike')}
										className={
											'text-primary hover:text-red-700 hover:bg-red-50 py-8 text-2xl'
										}
									>
										<ThumbsDown className="w-12 h-12 mr-4" />
										{getDislikesCount(question?.likes)}
									</Button>
									{likeLoading && <Loader2 className={'animate-spin'} />}
								</div>
								<span className="text-sm text-gray-500">
									{new Date(question.createdAt).toLocaleDateString('ru-RU')}
								</span>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Director's Answer */}
				{question?.directorAnswer && (
					<Card className="border-0 shadow-lg mb-8 border-l-4 border-l-green-500">
						<CardHeader>
							<CardTitle className="text-lg text-green-700">
								Ответ директора
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-700 mb-4">{question?.directorAnswer}</p>
							{question?.answeredAt && (
								<p className="text-sm text-gray-500">
									Опубликовано:{' '}
									{new Date(question?.answeredAt).toLocaleDateString('ru-RU')}
								</p>
							)}
						</CardContent>
					</Card>
				)}

				{question && (
					<CommentsSection
						data={question as CommentData}
						dataType={'questionToDirector'}
					/>
				)}
			</div>
		</div>
	);
}
