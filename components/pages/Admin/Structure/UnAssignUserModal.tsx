'use client';

import type React from 'react';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Position } from '@/types/structure';

import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useUnAssignUserToPosition } from '@/lib/api/queries/Structure/mutations/useUnAssignUserToPosition';

interface AssignUserModalProps {
	isOpen: boolean;
	onClose: () => void;
	position: Position;
}

export default function UnAssignUserModal({
	isOpen,
	onClose,
	position,
}: AssignUserModalProps) {
	const queryClient = useQueryClient();
	const { mutate: assignUser, isPending } = useUnAssignUserToPosition();
	const user = position?.user;
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!user) return;

		assignUser(
			{
				positionId: position.id,
				userId: user.id,
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: ['department-positions', position?.departmentId],
					});
					queryClient.invalidateQueries({
						queryKey: ['departments'],
					});
					onClose();
				},
			},
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Убрать сотрудника с должности</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="text-sm text-gray-500 p-2 rounded-md">
							Вы собираетесь убрать сотрудника с должности
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Отмена
						</Button>
						<Button type="submit" disabled={isPending || !user?.id}>
							{isPending ? <Loader2 className="animate-spin mr-2" /> : null}
							Убрать
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
