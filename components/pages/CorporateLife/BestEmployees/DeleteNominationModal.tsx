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
import { Nomination } from '@/types/content';
import { Loader2 } from 'lucide-react';

interface DeleteNominationModalProps {
	isOpen: boolean;
	onClose: () => void;
	nomination: Nomination;
	onDelete?: (id: string) => void;
	isLoading?: boolean;
}

export function DeleteNominationModal({
	isOpen,
	onClose,
	nomination,
	onDelete,
	isLoading,
}: DeleteNominationModalProps) {
	const handleDelete = () => {
		if (nomination.id && onDelete) {
			onDelete(nomination.id);
		}
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Удалить номинацию?</AlertDialogTitle>
					<AlertDialogDescription>
						Вы уверены, что хотите удалить номинацию &#34;{nomination.title}
						&#34;? Это действие нельзя отменить.
						{nomination.nominants.length > 0 && (
							<span className="block mt-2 font-medium">
								В номинации {nomination.nominants.length} номинантов.
							</span>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Отмена</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						disabled={isLoading}
						className="bg-primary hover:brightness-90"
					>
						{isLoading && <Loader2 className={'animate-spin mr-2'} />}
						{isLoading ? 'Удаление...' : 'Удалить'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
