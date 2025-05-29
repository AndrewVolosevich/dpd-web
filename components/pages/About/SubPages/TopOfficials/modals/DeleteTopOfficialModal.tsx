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

interface DeleteTopOfficialModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export const DeleteTopOfficialModal = ({
	isOpen,
	onClose,
	onConfirm,
}: DeleteTopOfficialModalProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Удалить запись</DialogTitle>
					<DialogDescription>
						Вы уверены, что хотите удалить запись? Это действие нельзя отменить.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Отмена
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						Удалить
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
