'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { QuestionToDirector } from '@/types/content';
import { useDeleteQuestionToDirector } from '@/lib/api/queries/Content/mutations/question-to-director/useDeleteQuestionToDirector';
import { Loader2 } from 'lucide-react';
import { getDislikesCount, getLikesCount } from '@/lib/socials';

interface DeleteQuestionModalProps {
	isOpen: boolean;
	onClose: () => void;
	question: QuestionToDirector;
}

export function DeleteQuestionToDirectorModal({
	isOpen,
	onClose,
	question,
}: DeleteQuestionModalProps) {
	const { mutate: deleteQuestion, isPending: deleteLoading } =
		useDeleteQuestionToDirector();

	const handleDelete = async () => {
		deleteQuestion(question.id, { onSettled: () => onClose() });
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Удалить вопрос?</AlertDialogTitle>
					<AlertDialogDescription className="space-y-2">
						<div>
							Вы уверены, что хотите удалить вопрос{' '}
							<strong>&#34;{question.title}&#34;</strong>?
						</div>
						<div className="text-sm">
							<strong>Автор:</strong> {question?.user?.surname}{' '}
							{question?.user?.name}
						</div>

						{!!question?.likes?.length && (
							<div className="text-sm">
								<strong>Голосов:</strong> {getLikesCount(question.likes)}{' '}
								лайков, {getDislikesCount(question.likes)} дизлайков
							</div>
						)}
						{question?.comments?.length ||
							(0 > 0 && (
								<div className="text-sm">
									<strong>Комментариев:</strong> {question?.comments?.length}
								</div>
							))}
						<div className="mt-3 p-3 bg-red-50 rounded-md">
							<p className="text-sm text-primary font-medium">
								Это действие нельзя отменить. Вопрос и все связанные с ним
								данные (комментарии, голоса) будут удалены навсегда.
							</p>
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={deleteLoading}>Отмена</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						disabled={deleteLoading}
						className="bg-primary hover:brightness-90"
					>
						{deleteLoading && <Loader2 className={'animate-spin mr-2'} />}
						{deleteLoading ? 'Удаление...' : 'Удалить вопрос'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
