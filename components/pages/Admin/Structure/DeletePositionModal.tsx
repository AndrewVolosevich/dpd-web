'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Position } from '@/types/structure';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useDeletePosition } from '@/lib/api/queries/structure/mutations/useDeletePosition';

interface DeletePositionModalProps {
	isOpen: boolean;
	onClose: () => void;
	position: Position;
}

export default function DeletePositionModal({
	isOpen,
	onClose,
	position,
}: DeletePositionModalProps) {
	const { mutate: deletePosition, isPending } = useDeletePosition();

	const handleDelete = () => {
		deletePosition(position.id, {
			onSuccess: () => {
				onClose();
			},
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="flex items-center">
						<AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
						Удалить должность
					</DialogTitle>
					<DialogDescription>
						Вы уверены, что хотите удалить должность &quot;{position.title}
						&quot;? Это действие нельзя отменить.
						{position.user && (
							<span className="block mt-2 font-semibold">
								Внимание: На этой должности числится сотрудник. Он будет отвязан
								от этой должности.
							</span>
						)}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:gap-0">
					<Button type="button" variant="outline" onClick={onClose}>
						Отмена
					</Button>
					<Button
						type="button"
						variant="destructive"
						onClick={handleDelete}
						disabled={isPending}
					>
						{isPending ? <Loader2 className="animate-spin mr-2" /> : null}
						Удалить
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
