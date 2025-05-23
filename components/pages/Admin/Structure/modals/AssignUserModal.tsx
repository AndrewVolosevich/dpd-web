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
import type { Position } from '@/types/structure';
import { Loader } from '@/components/common/Loader/Loader';
import { useUsers } from '@/lib/api/queries/Users/useUsers';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useAssignUserToPosition } from '@/lib/api/queries/Structure/mutations/useAssignUserToPosition';
import {
	Popover,
	WithoutPortalPopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from 'cmdk';
import { cn } from '@/lib/utils';
import { UserData } from '@/types/entities';

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
	const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
	const { data: users, isLoading: isLoadingUsers } = useUsers();
	const { mutate: assignUser, isPending } = useAssignUserToPosition();
	const [open, setOpen] = useState(false);

	// Reset selection when modal opens
	useEffect(() => {
		if (isOpen) {
			setSelectedUser(null);
		}
	}, [isOpen]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedUser?.id) return;

		assignUser(
			{
				positionId: position.id,
				userId: selectedUser?.id,
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
							{isLoadingUsers ? (
								<div className="flex justify-center p-2">
									<Loader />
								</div>
							) : availableUsers.length > 0 ? (
								<Popover open={open} onOpenChange={setOpen}>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											role="combobox"
											aria-expanded={open}
											className="w-full justify-between"
										>
											{selectedUser?.surname && selectedUser?.name
												? `${selectedUser.surname} ${selectedUser.name}`
												: 'Выберите сотрудника'}
											<ChevronsUpDown
												size={16}
												className="opacity-50 w-4 ml-2"
											/>
										</Button>
									</PopoverTrigger>
									<WithoutPortalPopoverContent
										className="w-full p-0 max-h-60 overflow-y-auto"
										style={{ width: 'var(--radix-popover-trigger-width)' }}
										align="start"
										sideOffset={4}
										side={'bottom'}
									>
										<Command>
											<CommandInput
												className={'p-2 outline-none'}
												placeholder="Поиск сотрудника..."
											/>
											<CommandList>
												<CommandEmpty className={'p-2'}>
													Сотрудник не найден
												</CommandEmpty>
												<CommandGroup>
													{users?.map((user) => (
														<CommandItem
															key={user.id}
															value={`${user.surname} ${user.name} ${user.patronymic}`}
															onSelect={() => {
																setSelectedUser(user);
																setOpen(false);
															}}
														>
															<div
																className={
																	'flex flex-row items-center justify-between cursor-pointer p-2'
																}
															>
																{user.surname} {user.name} {user.patronymic}
																<Check
																	className={cn(
																		'ml-auto',
																		selectedUser?.id === user.id
																			? 'opacity-100'
																			: 'opacity-0',
																	)}
																/>
															</div>
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>
									</WithoutPortalPopoverContent>
								</Popover>
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
						<Button type="submit" disabled={isPending || !selectedUser?.id}>
							{isPending ? <Loader2 className="animate-spin mr-2" /> : null}
							Назначить
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
