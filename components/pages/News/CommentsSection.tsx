'use client';
import React, { useState } from 'react';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { NewsModel } from '@/types/entities';
import { useAddComment } from '@/lib/api/queries/News/mutations/useAddComment';
import { Button } from '@/components/ui/button';
import { useDeleteComment } from '@/lib/api/queries/News/mutations/useDeleteComment';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const CommentsSection = ({ news }: { news: NewsModel }) => {
	const { user, isAdmin } = useAuth();
	const [content, setContent] = useState('');
	const { mutate: addComment, isPending: addCommentLoading } = useAddComment();
	const { mutate: deleteComment, isPending: deleteCommentLoading } =
		useDeleteComment();
	const handleAddComment = () => {
		addComment(
			{ newsId: news.id, content },
			{ onSuccess: () => setContent('') },
		);
	};

	const handleDeleteComment = (id: string) => {
		deleteComment(id);
	};

	return (
		<div className="mt-8 flex flex-col h-[500px] border rounded-lg shadow-sm bg-background">
			<div className="p-4 border-b flex items-center gap-2">
				<MessageSquare className="h-5 w-5 text-primary" />
				<h3 className="text-xl font-medium">Комментарии</h3>
			</div>

			{/* Scrollable comments area */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{news?.comments?.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-muted-foreground">
						<MessageSquare className="h-12 w-12 mb-2 opacity-20" />
						<p>Нет комментариев</p>
					</div>
				) : (
					news?.comments?.map((comment) => (
						<Card
							key={comment.id}
							className="p-4 relative hover:shadow-md transition-shadow"
						>
							<div className="flex items-start gap-3">
								<div className="flex-1">
									<div className="flex justify-between items-center mb-1">
										<p className="text-sm font-medium text-gray-600">
											{comment.user?.name} {comment.user?.surname}
										</p>
										<p className="text-xs text-muted-foreground">
											{new Date(comment?.createdAt).toLocaleString()}
										</p>
									</div>
									<p className="text-sm">{comment.content}</p>
								</div>
								{(isAdmin || comment.user?.id === user?.id) && (
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 rounded-full"
										onClick={() => handleDeleteComment(comment.id)}
										disabled={deleteCommentLoading}
									>
										<Trash2 className="h-4 w-4 text-destructive" />
										<span className="sr-only">Удалить комментарий</span>
									</Button>
								)}
							</div>
						</Card>
					))
				)}
			</div>

			<div className="p-4 border-t bg-muted/30">
				{user ? (
					<div className="flex flex-col gap-2">
						<Textarea
							className="min-h-24 resize-none bg-background"
							placeholder="Написать комментарий..."
							value={content}
							onChange={(e) => setContent(e.target.value)}
						/>
						<div className="flex justify-end">
							<Button
								onClick={handleAddComment}
								disabled={addCommentLoading || !content.trim()}
								className="gap-2"
							>
								<Send className="h-4 w-4" />
								Оставить комментарий
							</Button>
						</div>
					</div>
				) : (
					<div className="bg-muted/50 p-4 rounded-lg text-center">
						<p className="text-muted-foreground">
							Войдите, чтобы оставить комментарий.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default CommentsSection;
