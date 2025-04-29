'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Loader } from '@/components/common/Loader/Loader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserData } from '@/types/entities';
import useEducationCabinetsList from '@/lib/api/queries/Education/useEducationCabinetsList';
import { useAssignTaskToUser } from '@/lib/api/queries/Education/mutations/useAssignTaskToUser';
import DatePickerPopoverWithFields from '@/components/common/DatePickerPopover/DatePickerPopoverWithFields';
import { addMonths } from 'date-fns';

interface AssignMaterialModalProps {
	isOpen: boolean;
	onClose: () => void;
	employee?: UserData;
	supervisorPositionId?: string;
}

export function AssignMaterialModal({
	isOpen,
	onClose,
	employee,
	supervisorPositionId,
}: AssignMaterialModalProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
	const [dueDate, setDueDate] = useState<Date>(addMonths(new Date(), 3));

	const { data: cabinets, isLoading } = useEducationCabinetsList();
	// Фильтрация материалов на основе поискового запроса
	const filteredCabinets = useMemo(() => {
		if (!cabinets) return [];

		return cabinets
			.map((cabinet) => ({
				...cabinet,
				sections:
					cabinet.sections
						?.map((section) => ({
							...section,
							materials: section.materials.filter((material) =>
								material.title
									.toLowerCase()
									.includes(searchQuery.toLowerCase()),
							),
						}))
						.filter((section) => section.materials.length > 0) || [],
			}))
			.filter((cabinet) => cabinet.sections.length > 0);
	}, [cabinets, searchQuery]);

	// Получаем общее количество отфильтрованных материалов
	const totalFilteredMaterials = useMemo(() => {
		return filteredCabinets.reduce(
			(total, cabinet) =>
				total +
				cabinet.sections.reduce(
					(sectionTotal, section) => sectionTotal + section.materials.length,
					0,
				),
			0,
		);
	}, [filteredCabinets]);

	const handleSelectAll = () => {
		const allMaterialIds = filteredCabinets.flatMap((cabinet) =>
			(cabinet.sections || []).flatMap((section) =>
				section.materials.map((material) => material.id),
			),
		);

		if (selectedMaterials.length === allMaterialIds.length) {
			setSelectedMaterials([]);
		} else {
			setSelectedMaterials(allMaterialIds);
		}
	};

	const { mutate: assignMaterials, isPending: isAssigning } =
		useAssignTaskToUser();

	const handleSubmit = () => {
		if (!employee || selectedMaterials.length === 0 || !employee?.userPanelId) {
			toast({
				title: 'Ошибка',
				description:
					'Пожалуйста, выберите панель, материалы и заполните обязательные поля.',
				variant: 'destructive',
			});
			return;
		}
		assignMaterials(
			{
				materialIds: selectedMaterials,
				userPanelId: employee?.userPanelId,
				dueDate,
				supervisorPositionId,
			},
			{
				onSuccess: () => {
					onClose();
				},
			},
		);
	};

	// Reset selected materials when modal is opened
	useEffect(() => {
		if (isOpen) {
			setSelectedMaterials([]);
			setSearchQuery('');
			setDueDate(addMonths(new Date(), 3));
		}
	}, [isOpen]);
	const getDateInputDisabled = (date: Date) => date < new Date();
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Назначить учебные материалы</DialogTitle>
				</DialogHeader>

				{employee && (
					<div className="mb-4 p-3 bg-muted rounded-md">
						<div className="font-medium">Сотрудник:</div>
						<div>
							{employee.surname} {employee.name} {employee.patronymic}
						</div>
						<div className="text-sm text-muted-foreground">
							{employee.position?.title}
						</div>
					</div>
				)}

				{/* Поле для выбора крайнего срока */}
				<div className="mb-4">
					<Label htmlFor="dueDate">Крайний срок выполнения</Label>
					<DatePickerPopoverWithFields
						formControl={false}
						value={dueDate}
						disabled={getDateInputDisabled}
						onChange={(e) => {
							if (e) {
								setDueDate(e);
							}
						}}
					/>
				</div>

				<div className="relative mb-4">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Поиск материалов..."
						className="pl-8"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				{isLoading ? (
					<div className="flex justify-center items-center h-[200px]">
						<Loader />
					</div>
				) : (
					<>
						<div className="flex items-center space-x-2 mb-2">
							<Checkbox
								id="select-all"
								checked={
									selectedMaterials.length > 0 &&
									selectedMaterials.length === totalFilteredMaterials
								}
								onCheckedChange={handleSelectAll}
							/>
							<Label htmlFor="select-all" className="text-sm font-medium">
								Выбрать все материалы ({totalFilteredMaterials})
							</Label>
						</div>

						<ScrollArea className="h-[300px] pr-4">
							<div className="space-y-6">
								{filteredCabinets.map((cabinet) => (
									<div key={cabinet.id}>
										{cabinet.sections.map((section) => (
											<div key={section.id} className="mb-4">
												<div className="font-medium text-sm text-muted-foreground mb-2">
													{cabinet.title} / {section.title}
												</div>
												<div className="space-y-2 pl-2">
													{section.materials.map((material) => (
														<div
															key={material.id}
															className="flex items-start space-x-2 p-2 rounded hover:bg-muted"
														>
															<Checkbox
																id={`material-${material.id}`}
																checked={selectedMaterials.includes(
																	material.id,
																)}
																onCheckedChange={(checked) => {
																	if (checked) {
																		setSelectedMaterials([
																			...selectedMaterials,
																			material.id,
																		]);
																	} else {
																		setSelectedMaterials(
																			selectedMaterials.filter(
																				(id) => id !== material.id,
																			),
																		);
																	}
																}}
															/>
															<div className="grid gap-1">
																<Label
																	htmlFor={`material-${material.id}`}
																	className="font-medium"
																>
																	{material.title}
																</Label>
																<div className="text-xs text-muted-foreground">
																	{material.url ? 'Ссылка' : 'Файл'} •{' '}
																	{new Date(
																		material.createdAt,
																	).toLocaleDateString()}
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										))}
									</div>
								))}

								{totalFilteredMaterials === 0 && (
									<div className="text-center py-8 text-muted-foreground">
										{searchQuery
											? 'Материалы не найдены'
											: 'Нет доступных материалов'}
									</div>
								)}
							</div>
						</ScrollArea>
					</>
				)}

				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isAssigning}>
						Отмена
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={selectedMaterials.length === 0 || isAssigning}
					>
						{isAssigning && <Loader2 className="animate-spin mr-2" />}
						Назначить
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
