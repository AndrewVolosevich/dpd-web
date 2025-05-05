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
import { FileText, AlertTriangle } from 'lucide-react';
import { Assignment } from '@/types/education';
import { ExtendedUserData } from '@/types/entities';
import { getFileNameFromUrl } from '@/lib/getFileNameFromUrl';
import { useDeleteAssignment } from '@/lib/api/queries/Education/mutations/assign/useDeleteAssignment';

interface DeleteAdaptationPlanModalProps {
	isOpen: boolean;
	onClose: () => void;
	employee: ExtendedUserData;
	assignment: Assignment | null;
}

export function DeleteAdaptationPlanModal({
	isOpen,
	onClose,
	employee,
	assignment,
}: DeleteAdaptationPlanModalProps) {
	const { mutate: deleteAssignment, isPending } = useDeleteAssignment();

	const handleDelete = async () => {
		if (assignment?.id) {
			deleteAssignment(assignment?.id, {
				onSuccess: () => {
					onClose();
				},
			});
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Удалить план адаптации</DialogTitle>
					<DialogDescription>
						Вы уверены, что хотите удалить план адаптации для этого сотрудника?
						Это действие нельзя отменить.
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<div className="p-3 bg-muted rounded-md mb-4">
						<div className="font-medium">
							{employee?.surname} {employee?.name} {employee?.patronymic}
						</div>
						<div className="text-sm text-muted-foreground">
							{employee?.position?.title}
						</div>
					</div>

					<div className="flex items-center p-3 border rounded-md bg-red-50">
						<AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
						<div>
							<p className="text-sm font-medium">Будет удален файл:</p>
							<div className="flex items-center mt-1">
								<FileText className="h-4 w-4 mr-2 text-muted-foreground" />
								<p className="text-sm">
									{getFileNameFromUrl(assignment?.adaptationPlan?.fileUrl)}
								</p>
							</div>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button type="button" variant="outline" onClick={onClose}>
						Отмена
					</Button>
					<Button
						type="button"
						variant="destructive"
						onClick={handleDelete}
						disabled={isPending}
					>
						{isPending ? 'Удаление...' : 'Удалить план'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
