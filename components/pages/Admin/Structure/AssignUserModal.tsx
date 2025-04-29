'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { Position } from '@/types/structure';
import { Loader } from '@/components/common/Loader/Loader';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useAssignUserToPosition } from '@/lib/api/queries/structure/mutations/useAssignUserToPosition';
import { useUsers } from '@/lib/api/queries/Users/useUsers';
import { Loader2 } from 'lucide-react';

interface AssignUserModalProps {
	isOpen: boolean;
	onClose: () => void;
	position: Position;
}

export default function AssignUserModal({
	isOpen,
	onClose,
	position,
}: AssignUserModalProps) {
	const [selectedUserId, setSelectedUserId] = useState<string>('');
	const { data: users, isLoading: isLoadingUsers } = useUsers();
	const { mutate: assignUser, isPending } = useAssignUserToPosition();

	// Reset selection when modal opens
	useEffect(() => {
		if (isOpen) {
			setSelectedUserId('');
		}
	}, [isOpen]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedUserId) return;

		assignUser(
			{
				positionId: position.id,
				userId: selectedUserId,
			},
			{
				onSuccess: () => {
					onClose();
				},
			},
		);
	};

	// Filter out users who are already assigned to this position
	const availableUsers =
		users?.filter((user) => position?.user?.id !== user.id) || [];

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Назначить сотрудника на должность</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="user">Выберите сотрудника</Label>
							{isLoadingUsers ? (
								<div className="flex justify-center p-2">
									<Loader />
								</div>
							) : availableUsers.length > 0 ? (
								<Select
									value={selectedUserId}
									onValueChange={setSelectedUserId}
								>
									<SelectTrigger>
										<SelectValue placeholder="Выберите сотрудника" />
									</SelectTrigger>
									<SelectContent>
										{availableUsers.map((user) => (
											<SelectItem key={user.id} value={user.id}>
												{user.surname} {user.name} {user.patronymic}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							) : (
								<div className="text-sm text-gray-500 p-2 border rounded-md">
									Нет доступных сотрудников для назначения
								</div>
							)}
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Отмена
						</Button>
						<Button type="submit" disabled={isPending || !selectedUserId}>
							{isPending ? <Loader2 className="animate-spin mr-2" /> : null}
							Назначить
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
