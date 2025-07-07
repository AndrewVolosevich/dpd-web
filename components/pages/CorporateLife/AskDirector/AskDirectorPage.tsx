'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Check,
	Edit,
	HelpCircle,
	Loader2,
	MessageSquare,
	Plus,
	Search,
	ThumbsDown,
	ThumbsUp,
	Trash2,
	X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { EditQuestionToDirectorModal } from '@/components/pages/CorporateLife/AskDirector/EditQuestionToDirectorModal';
import { RulesModal } from '@/components/pages/CorporateLife/AskDirector/RulesModal';
import { Routes } from '@/const/routes';
import useQuestionsToDirector from '@/lib/api/queries/Content/useQuestionsToDirector';
import { QuestionToDirector, QuestionToDirectorStatus } from '@/types/content';
import { DeleteQuestionToDirectorModal } from '@/components/pages/CorporateLife/AskDirector/DeleteQuestionToDirectorModal';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { getDislikesCount, getLikesCount, getStatusBadge } from '@/lib/socials';
import { useToggleLike } from '@/lib/api/queries/Socials/useToggleLike';
import { useEditQuestionToDirector } from '@/lib/api/queries/Content/mutations/question-to-director/useEditQuestionToDirector';

const statuses = [
	'ALL',
	QuestionToDirectorStatus.MODERATION,
	QuestionToDirectorStatus.APPROVED,
	QuestionToDirectorStatus.REJECTED,
	QuestionToDirectorStatus.ANSWERED,
] as const;

type Status = (typeof statuses)[number];

const getTextForStatus = (value: Status) => {
	switch (value) {
		case 'ALL':
			return 'Все статусы';
		case QuestionToDirectorStatus.MODERATION:
			return 'На модерации';
		case QuestionToDirectorStatus.APPROVED:
			return 'Опубликован';
		case QuestionToDirectorStatus.REJECTED:
			return 'Отклонен';
		case QuestionToDirectorStatus.ANSWERED:
			return 'Есть ответ директора';
		default:
			return value;
	}
};

export default function AskDirectorPage() {
	const { isAdmin } = useAuth();
	const [questionStatus, setQuestionStatus] = useState('ALL');
	const [searchQuery, setSearchQuery] = useState('');
	const [isAskModalOpen, setIsAskModalOpen] = useState(false);
	const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
	const [editingQuestion, setEditingQuestion] =
		useState<QuestionToDirector | null>(null);
	const [deletingQuestion, setDeletingQuestion] =
		useState<QuestionToDirector | null>(null);

	const { data: questions } = useQuestionsToDirector();
	const { mutate: like, isPending: likeLoading } = useToggleLike();
	const { mutate: updateQuestion } = useEditQuestionToDirector();

	const handleVote = (id: string, type: 'like' | 'dislike') => {
		like({ questionToDirectorId: id, isLike: type === 'like' });
	};
	const filteredQuestions = questions?.filter((question) => {
		const matchesStatus =
			questionStatus === 'ALL' || question.status === questionStatus;

		return (
			matchesStatus &&
			(question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				question.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
				question?.description
					?.toLowerCase()
					?.includes(searchQuery.toLowerCase()) ||
				`${question?.user?.name} ${question?.user?.surname}`
					.toLowerCase()
					.includes(searchQuery.toLowerCase()))
		);
	});

	const getInitials = (name?: string, surname?: string) => {
		return `${name?.charAt(0)}${surname?.charAt(0)}`.toUpperCase();
	};

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
						<BreadcrumbPage>Список вопросов директору</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Список вопросов директору</h1>
					<p className="mt-2">
						Задавайте вопросы руководству и голосуйте за актуальные темы
					</p>
				</div>
				<div className="flex gap-3">
					<Button
						onClick={() => setIsRulesModalOpen(true)}
						variant="outline"
						className="bg-transparent hover:text-primary"
					>
						<HelpCircle className="w-4 h-4 mr-2" />
						Правила
					</Button>
					<Button
						onClick={() => setIsAskModalOpen(true)}
						className="hover:brightness-90"
					>
						<Plus className="w-4 h-4 mr-2" />
						Задать вопрос
					</Button>
				</div>
			</div>

			{/* Filters */}
			<div className="max-w-6xl mx-auto px-6 py-6">
				<div className="flex flex-col md:flex-row gap-4 mb-6">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<Input
							placeholder="Поиск по вопросам, авторам..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
					{isAdmin && (
						<div className="relative flex-1">
							<select
								value={questionStatus}
								onChange={(e) => setQuestionStatus(e.target.value)}
								className="px-3 py-2 border border-gray-300 rounded-md bg-transparent w-full "
							>
								{statuses.map((status) => (
									<option key={status} value={status}>
										{getTextForStatus(status)}
									</option>
								))}
							</select>
						</div>
					)}
				</div>

				<div className="space-y-6">
					{filteredQuestions?.map((question) => (
						<Card
							key={question.id}
							className="border-0 shadow-md hover:shadow-lg transition-shadow"
						>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex items-start gap-4 flex-1">
										<Avatar className="w-12 h-12">
											<AvatarImage
												src={question?.user?.photo || '/placeholder.svg'}
											/>
											<AvatarFallback className="bg-red-100 text-primary">
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
													{question?.user?.position?.title || ''}
												</span>
											</div>
											<Link
												href={`${Routes.CORPORATE_LIFE}/question-to-director/${question.id}`}
											>
												<CardTitle className="text-lg hover:text-red-600 transition-colors cursor-pointer">
													{question.title}
												</CardTitle>
											</Link>
											<Badge variant="outline" className="mt-2 text-xs">
												{question.category}
											</Badge>
										</div>
									</div>
									<div className="flex items-center gap-2 ml-4">
										<Link
											href={`${Routes.CORPORATE_LIFE}/question-to-director/${question.id}`}
										>
											{getStatusBadge(question.status)}
										</Link>

										{isAdmin && (
											<div className="flex gap-1">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => setEditingQuestion(question)}
													className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
													tooltip={'Редактировать'}
												>
													<Edit className="w-4 h-4" />
												</Button>
												{question.status ===
													QuestionToDirectorStatus.MODERATION && (
													<>
														<Button
															variant="ghost"
															size="icon"
															onClick={() => {
																updateQuestion({
																	id: question.id,
																	status: QuestionToDirectorStatus.APPROVED,
																});
															}}
															className="h-8 w-8 text-gray-400"
															tooltip={'Одобрить к публикации'}
														>
															<Check className="w-4 h-4" />
														</Button>
														<Button
															variant="ghost"
															size="icon"
															onClick={() => {
																updateQuestion({
																	id: question.id,
																	status: QuestionToDirectorStatus.REJECTED,
																});
															}}
															className="h-8 w-8 text-gray-400"
															tooltip={'Отклонить'}
														>
															<X className="w-4 h-4" />
														</Button>
													</>
												)}
												<Button
													variant="ghost"
													size="icon"
													onClick={() => setDeletingQuestion(question)}
													className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
													tooltip={'Удалить'}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										)}
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600 mb-4 line-clamp-2">
									{question.description}
								</p>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div className="flex items-center gap-2">
											<Button
												variant="ghost"
												size="lg"
												className="text-green-600 hover:text-green-700 hover:bg-green-50 px-4"
												onClick={() => handleVote(question.id, 'like')}
											>
												<ThumbsUp className="w-6 h-6 mr-2" />
												{getLikesCount(question?.likes)}
											</Button>
											<Button
												variant="ghost"
												size="lg"
												className="text-primary hover:text-primary hover:bg-red-50 px-4"
												onClick={() => handleVote(question.id, 'dislike')}
											>
												<ThumbsDown className="w-6 h-6 mr-2" />
												{getDislikesCount(question?.likes)}
											</Button>
										</div>
										<div className="flex items-center gap-1 text-gray-500 px-4">
											<MessageSquare className="w-6 h-6" />
											<span className="text-sm">
												{question.comments?.length || 0}
											</span>
										</div>
										{likeLoading && <Loader2 className={'animate-spin'} />}
									</div>
									<span className="text-sm text-gray-500">
										{new Date(question.createdAt).toLocaleDateString('ru-RU')}
									</span>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{filteredQuestions?.length === 0 && (
					<div className="text-center py-12">
						<MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							Вопросы не найдены
						</h3>
						<p className="text-gray-500 mb-4">
							Попробуйте изменить параметры поиска или задайте первый вопрос
						</p>
						<Button
							onClick={() => setIsAskModalOpen(true)}
							className="bg-primary hover:brightness-90"
						>
							<Plus className="w-4 h-4 mr-2" />
							Задать вопрос
						</Button>
					</div>
				)}
			</div>

			{/* Modals */}
			<EditQuestionToDirectorModal
				isOpen={isAskModalOpen || !!editingQuestion}
				onClose={() => {
					setIsAskModalOpen(false);
					setEditingQuestion(null);
				}}
				question={editingQuestion}
			/>
			<RulesModal
				isOpen={isRulesModalOpen}
				onClose={() => setIsRulesModalOpen(false)}
			/>
			{deletingQuestion && isAdmin && (
				<DeleteQuestionToDirectorModal
					isOpen={!!deletingQuestion}
					onClose={() => setDeletingQuestion(null)}
					question={deletingQuestion}
				/>
			)}
		</div>
	);
}
