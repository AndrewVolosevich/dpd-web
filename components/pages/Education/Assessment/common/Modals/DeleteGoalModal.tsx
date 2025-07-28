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
import { Loader2 } from 'lucide-react';

interface DeleteGoalModalProps {
	isOpen: boolean;
	onClose: () => void;
	onDelete?: () => void;
	isLoading?: boolean;
}

export function DeleteGoalModal({
	isOpen,
	onClose,
	onDelete,
	isLoading,
}: DeleteGoalModalProps) {
	const handleDelete = () => {
		onDelete?.();
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Удалить цель?</AlertDialogTitle>
					<AlertDialogDescription>
						Вы уверены, что хотите удалить эту цель? Это действие нельзя
						отменить.
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
