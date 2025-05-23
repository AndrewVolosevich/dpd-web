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
import type { Department } from '@/types/structure';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useDeleteDepartment } from '@/lib/api/queries/Structure/mutations/useDeleteDepartment';

interface DeleteDepartmentModalProps {
	isOpen: boolean;
	onClose: () => void;
	department: Department;
}

export default function DeleteDepartmentModal({
	isOpen,
	onClose,
	department,
}: DeleteDepartmentModalProps) {
	const { mutate: deleteDepartment, isPending } = useDeleteDepartment();

	const handleDelete = () => {
		deleteDepartment(department.id, {
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
						Удалить департамент
					</DialogTitle>
					<DialogDescription>
						Вы уверены, что хотите удалить департамент &quot;{department.title}
						&quot;? Это действие нельзя отменить. Все подотделы и должности
						также будут удалены.
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
