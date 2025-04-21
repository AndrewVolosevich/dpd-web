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

interface DeleteCabinetModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	cabinetTitle: string;
}

export const DeleteCabinetModal = ({
	isOpen,
	onClose,
	onConfirm,
	cabinetTitle,
}: DeleteCabinetModalProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Удалить кабинет</DialogTitle>
					<DialogDescription>
						Вы уверены, что хотите удалить кабинет &#34;{cabinetTitle}&#34;? Это
						действие нельзя отменить.
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
