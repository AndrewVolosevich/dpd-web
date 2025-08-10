'use client';

import type React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { ThanksTo } from '@/types/content';
import { useDeleteThanksTo } from '@/lib/api/queries/Content/mutations/thanks-to/useDeleteThanksTo';

interface DeleteThanksModalProps {
	isOpen: boolean;
	onClose: () => void;
	thanks: ThanksTo;
}

export const DeleteThanksModal: React.FC<DeleteThanksModalProps> = ({
	isOpen,
	onClose,
	thanks,
}) => {
	const { mutate: deleteThanksTo, isPending } = useDeleteThanksTo();

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
							<AlertTriangle className="h-5 w-5 text-red-600" />
						</div>
						<div>
							<DialogTitle>Удалить благодарность</DialogTitle>
							<DialogDescription className="mt-1">
								Это действие нельзя отменить
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="py-4">
					<p className="text-sm text-gray-600">
						Вы уверены, что хотите удалить благодарность{' '}
						<span className="font-semibold">&#34;{thanks?.title}&#34;</span>?
					</p>
					<p className="text-sm text-gray-500 mt-2">
						Все связанные с ней данные будут безвозвратно удалены.
					</p>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Отмена
					</Button>
					<Button
						disabled={isPending}
						variant="destructive"
						onClick={() => {
							deleteThanksTo(thanks?.id, {
								onSuccess: () => {
									onClose();
								},
							});
						}}
					>
						{isPending ? <Loader2 className="animate-spin mr-2" /> : null}
						Удалить
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
