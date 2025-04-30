'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { UserData } from '@/types/entities';
import useSurveysList from '@/lib/api/queries/Education/useSurveysList';
import { useAssignTaskToUser } from '@/lib/api/queries/Education/mutations/useAssignTaskToUser';
import DatePickerPopoverWithFields from '@/components/common/DatePickerPopover/DatePickerPopoverWithFields';
import { addMonths } from 'date-fns';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/common/Loader/Loader';

interface AssignTestModalProps {
	isOpen: boolean;
	onClose: () => void;
	employee?: UserData;
	supervisorPositionId?: string;
}

export function AssignTestModal({
	isOpen,
	onClose,
	employee,
	supervisorPositionId,
}: AssignTestModalProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [dueDate, setDueDate] = useState<Date>(addMonths(new Date(), 3));
	const [selectedSurveyIds, setSelectedSurveyIds] = useState<string[]>();
	const { data: availableSurveys, isLoading } = useSurveysList({
		status: 'ACTIVE',
		unpassedOnly: 'true',
		userId: employee?.id,
	});
	const filteredSurveys = useMemo(() => {
		if (!availableSurveys) return [];
		return availableSurveys.filter((survey) =>
			survey.title.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [availableSurveys, searchQuery]);

	const { mutate: assignSurveys, isPending } = useAssignTaskToUser();

	const toggleSelectAllTests = () => {
		if (
			filteredSurveys?.length &&
			selectedSurveyIds?.length === filteredSurveys?.length
		) {
			setSelectedSurveyIds([]);
		} else {
			setSelectedSurveyIds(filteredSurveys?.map((survey) => survey.id) || []);
		}
	};

	const toggleTest = (surveyId: string) => {
		if (selectedSurveyIds?.includes(surveyId)) {
			setSelectedSurveyIds(selectedSurveyIds?.filter((id) => id !== surveyId));
		} else {
			setSelectedSurveyIds([...(selectedSurveyIds || []), surveyId]);
		}
	};

	const handleSubmit = () => {
		if (employee?.userPanelId) {
			assignSurveys(
				{
					surveyIds: selectedSurveyIds,
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
		}
	};

	// Reset selected materials when modal is opened
	useEffect(() => {
		if (isOpen) {
			setSelectedSurveyIds([]);
			setSearchQuery('');
			setDueDate(addMonths(new Date(), 3));
		}
	}, [isOpen]);
	const getDateInputDisabled = (date: Date) => date < new Date();

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[500px] min-h-[600px]">
				<DialogHeader>
					<DialogTitle>Назначить опросы/тесты для</DialogTitle>
				</DialogHeader>

				{employee && (
					<div className="p-3 bg-muted rounded-md">
						<div className="font-medium">Сотрудник:</div>
						<div>
							{employee.surname} {employee.name} {employee.patronymic}
						</div>
						<div className="text-sm text-muted-foreground">
							{employee.position?.title}
						</div>
					</div>
				)}

				{/* Поле для выбора срока выполнения */}
				<div className="mb-4">
					<Label htmlFor="dueDate">Срок выполнения</Label>
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

				<div className="relative">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Поиск материалов..."
						className="pl-8"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<div className="space-y-4 py-4">
					{isLoading ? (
						<div className="flex justify-center items-center h-[200px]">
							<Loader />
						</div>
					) : (
						<div className="border-t pt-4">
							<h3 className="mb-2 font-medium">
								Выберите опросы/тесты для назначения
							</h3>
							{!!filteredSurveys?.length && (
								<>
									<div className="flex items-center space-x-2 mb-2">
										<Checkbox
											id="select-all-tests"
											checked={
												!!(
													selectedSurveyIds?.length ===
														availableSurveys?.length &&
													availableSurveys?.length &&
													availableSurveys?.length > 0
												)
											}
											onCheckedChange={toggleSelectAllTests}
										/>
										<Label
											htmlFor="select-all-tests"
											className="text-sm font-medium"
										>
											{selectedSurveyIds?.length === availableSurveys?.length &&
											availableSurveys?.length &&
											availableSurveys?.length > 0
												? 'Снять выделение со всех'
												: 'Выбрать все опросы/тесты'}
										</Label>
									</div>

									<ScrollArea className="h-[200px] pr-4">
										<div className="space-y-2">
											{filteredSurveys?.map((survey) => (
												<div
													key={survey.id}
													className="flex items-center space-x-2"
												>
													<Checkbox
														id={`survey-${survey.id}`}
														checked={selectedSurveyIds?.includes(survey.id)}
														onCheckedChange={() => toggleTest(survey.id)}
													/>
													<Label
														htmlFor={`survey-${survey.id}`}
														className="text-sm"
													>
														{survey.title}
														<p className="text-xs text-muted-foreground">
															{survey.description}
														</p>
													</Label>
												</div>
											))}
											{filteredSurveys?.length === 0 && (
												<p className="text-sm text-muted-foreground">
													Тесты/опросы не найдены
												</p>
											)}
										</div>
									</ScrollArea>
								</>
							)}
						</div>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Отмена
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isPending || selectedSurveyIds?.length === 0}
					>
						{isPending ? 'Назначение...' : 'Назначить'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
