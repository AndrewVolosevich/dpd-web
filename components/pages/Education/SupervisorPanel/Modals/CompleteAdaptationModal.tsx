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
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Assignment } from '@/types/education';
import { ExtendedUserData } from '@/types/entities';
import { useCompleteAssignment } from '@/lib/api/queries/Education/mutations/assign/useCompleteAssignment';

interface CompleteAdaptationModalProps {
	isOpen: boolean;
	onClose: () => void;
	employee: ExtendedUserData;
	assignment: Assignment;
}

export function CompleteAdaptationModal({
	isOpen,
	onClose,
	employee,
	assignment,
}: CompleteAdaptationModalProps) {
	const { mutate: completeAssignment, isPending } = useCompleteAssignment();

	const handleComplete = async () => {
		if (assignment?.id) {
			completeAssignment(assignment?.id, {
				onSuccess: () => {
					onClose();
				},
			});
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Завершить адаптацию</DialogTitle>
					<DialogDescription>
						Вы уверены, что хотите завершить адаптацию для этого сотрудника?
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<div className="p-3 bg-muted rounded-md">
						<div className="font-medium">
							{employee?.surname} {employee?.name} {employee?.patronymic}
						</div>
						<div className="text-sm text-muted-foreground">
							{employee?.position?.title}
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button type="button" variant="outline" onClick={onClose}>
						Отмена
					</Button>
					<Button type="button" onClick={handleComplete} disabled={isPending}>
						{isPending ? (
							<Loader2 className="animate-spin mr-2" />
						) : (
							<CheckCircle2 className="h-4 w-4 mr-2" />
						)}
						Завершить
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
