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
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
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
import { useAllPositions } from '@/lib/api/queries/Structure/useAllPositions';
import { useReassignUserToPosition } from '@/lib/api/queries/Structure/mutations/useReassignUserToPosition';

interface AssignUserModalProps {
	isOpen: boolean;
	onClose: () => void;
	position: Position;
}

export default function ReassignUserModal({
	isOpen,
	onClose,
	position,
}: AssignUserModalProps) {
	const [selectedPosition, setSelectedPosition] = useState<Position | null>(
		null,
	);
	const { mutate: assignUser, isPending: mutateLoading } =
		useReassignUserToPosition();
	const { data: positions, isPending } = useAllPositions();
	const [open, setOpen] = useState(false);

	// Reset selection when modal opens
	useEffect(() => {
		if (isOpen) {
			setSelectedPosition(null);
		}
	}, [isOpen]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedPosition?.id) return;

		assignUser(
			{
				currentPositionId: position.id,
				newPositionId: selectedPosition?.id,
			},
			{
				onSuccess: () => {
					onClose();
				},
			},
		);
	};

	// Выбираем только пустые позиции
	const availablePositions =
		positions?.filter((position) => !position?.userId) || [];

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Переместить сотрудника на новую должность</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							{isPending ? (
								<div className="flex justify-center p-2">
									<Loader />
								</div>
							) : availablePositions.length > 0 ? (
								<Popover open={open} onOpenChange={setOpen}>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											role="combobox"
											aria-expanded={open}
											className="w-full justify-between"
										>
											{selectedPosition?.id && selectedPosition?.title
												? `${selectedPosition?.title}`
												: 'Выберите позицию'}
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
													Позиция не найдена
												</CommandEmpty>
												<CommandGroup>
													{availablePositions?.map((position) => (
														<CommandItem
															key={position.id}
															value={`${position?.title}`}
															onSelect={() => {
																setSelectedPosition(position);
																setOpen(false);
															}}
														>
															<div
																className={
																	'flex flex-row items-center justify-between cursor-pointer p-2'
																}
															>
																{position?.title}
																<Check
																	className={cn(
																		'ml-auto',
																		selectedPosition?.id === position.id
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
									Нет доступных позиций
								</div>
							)}
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Отмена
						</Button>
						<Button
							type="submit"
							disabled={mutateLoading || !selectedPosition?.id}
						>
							{isPending ? <Loader2 className="animate-spin mr-2" /> : null}
							Переместить
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
