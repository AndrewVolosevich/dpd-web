'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

interface DeleteTimeLineModalProps {
	isOpen: boolean;
	isLoading?: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export const DeleteTimeLineModal = ({
	isOpen,
	onClose,
	onConfirm,
	isLoading,
}: DeleteTimeLineModalProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Удалить запись года</DialogTitle>
					<DialogDescription>
						Вы уверены, что хотите удалить запись для этого года? Это действие
						нельзя отменить.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Отмена
					</Button>
					<Button
						disabled={isLoading}
						variant="destructive"
						onClick={onConfirm}
					>
						{isLoading ? 'Удаление...' : 'Удалить'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
