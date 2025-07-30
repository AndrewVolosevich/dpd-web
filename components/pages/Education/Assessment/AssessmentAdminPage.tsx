'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Filter, Settings, X } from 'lucide-react';
import { useAssessmentUsers } from '@/lib/api/queries/Assessment/useAssesmentUsers';
import { AssessmentStatus, AssessmentType } from '@/types/assessment';
import { Button } from '@/components/ui/button';
import { useBulkAssessment } from '@/lib/api/queries/Assessment/mutations/useBulkAssessment';
import { getAssessmentTypeBadge } from '@/components/pages/Education/Assessment/common/getAssessmentTypeBadge';
import DatePickerPopover from '@/components/common/DatePickerPopover/DatePickerPopover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getAssessmentStatusBadge } from '@/components/pages/Education/Assessment/common/getAssessmentStatusBadge';
import { exportGeneralAssessmentGroupedByDepartment } from '@/lib/assessmentToCsv';
import { useAllYearAssessments } from '@/lib/api/queries/Assessment/useAllYearAssessment';

export const AssessmentAdminPage = () => {
	const { data: users = [] } = useAssessmentUsers();
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const currentYear = new Date().getFullYear(); // Текущий год
	const [bulkEvaluationType, setBulkEvaluationType] = useState<AssessmentType>(
		AssessmentType.FULL,
	);
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

	// Фильтры и сортировка
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedYear, setSelectedYear] = useState<number>(currentYear); // Фильтр по году

	const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
	const [showPositionFilter, setShowPositionFilter] = useState(false);

	const positions = [
		...new Set(
			users.reduce<string[]>((acc, user) => {
				if (user?.position) {
					acc.push(user?.position?.title);
				}
				return acc;
			}, []),
		),
	].sort((a, b) => a.localeCompare(b));

	const handlePositionToggle = (position: string) => {
		setSelectedPositions((prev) =>
			prev.includes(position)
				? prev.filter((p) => p !== position)
				: [...prev, position],
		);
	};
	const removePositionFilter = (position: string) => {
		setSelectedPositions((prev) => prev.filter((p) => p !== position));
	};
	const clearAllPositionFilters = () => {
		setSelectedPositions([]);
	};

	// Логика фильтрации пользователей с учетом года оценки
	const filteredUsers = users.filter((user) => {
		const matchesSearch =
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user?.position?.title?.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesPosition =
			selectedPositions.length === 0 ||
			(user?.position?.title &&
				selectedPositions.includes(user?.position?.title));

		return (
			matchesSearch &&
			matchesPosition &&
			// Если для пользователя нет оценки за выбранный год, он включается с "не назначено"
			(user.assessment?.some(
				(assessment) => assessment.year === selectedYear,
			) ||
				true)
		);
	});

	// const { mutate: createAssessment, isPending: createAssessmentLoading } =
	// 	useCreateAssessment();
	// const { mutate: updateAssessment, isPending: updateAssessmentLoading } =
	// 	useUpdateAssessment();
	const { mutate: bulkAssessment, isPending: bulkAssessmentLoading } =
		useBulkAssessment();

	// Выбор/снятие выбора пользователя
	const handleUserSelect = (userId: string, isSelected: boolean) => {
		setSelectedUserIds((prev) =>
			isSelected ? [...prev, userId] : prev.filter((id) => id !== userId),
		);
	};

	// Выбор/снятие всех пользователей
	const handleSelectAll = (isSelected: boolean) => {
		setSelectedUserIds(isSelected ? filteredUsers.map((user) => user.id) : []);
	};

	// Изменение типа оценки для одного пользователя
	// const handleEvaluationTypeChange = (userId: string, type: AssessmentType) => {
	// 	// Найти существующую оценку за выбранный год
	// 	const existingAssessment = users
	// 		.find((user) => user.id === userId)
	// 		?.assessment?.find((assessment) => assessment.year === selectedYear);
	//
	// 	if (existingAssessment) {
	// 		updateAssessment({
	// 			userId,
	// 			id: existingAssessment.id,
	// 			type,
	// 			status: AssessmentStatus.SELF_ASSESSMENT,
	// 			year: selectedYear,
	// 		});
	// 	} else {
	// 		// Если оценки нет, создаём новую
	// 		createAssessment({
	// 			userId,
	// 			type,
	// 			status: AssessmentStatus.SELF_ASSESSMENT,
	// 			year: selectedYear,
	// 		});
	// 	}
	// };

	// Массовое изменение типов оценки
	const handleBulkEvaluationTypeChange = () => {
		bulkAssessment({
			userIds: selectedUserIds,
			type: bulkEvaluationType,
			year: selectedYear,
			status:
				bulkEvaluationType === AssessmentType.FULL
					? AssessmentStatus.SELF_ASSESSMENT
					: AssessmentStatus.SUPERVISOR_ASSESSMENT,
			startDate,
			dueDate,
		});
	};

	const [selectedExportYear, setSelectedExportYear] = useState<
		number | undefined
	>(undefined);
	const { data: exportData } = useAllYearAssessments(selectedExportYear);

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Администрирование оценки</h1>
					<p className="text-muted-foreground mt-1">
						Назначение типов оценки для сотрудников
					</p>
				</div>
				<div className="flex items-center space-x-2">
					<Settings className="w-5 h-5 text-muted-foreground" />
					<span className="text-sm text-muted-foreground">
						Всего пользователей: {users.length}
					</span>
				</div>
			</div>

			{/* Выгрузка */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Выгрузка данных</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-3 flex flex-row justify-between">
						<div className="w-1/3">
							<Select
								value={selectedExportYear?.toString()}
								onValueChange={(value) => setSelectedExportYear(Number(value))}
							>
								<SelectTrigger>
									<SelectValue placeholder="Выберите год" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={String(currentYear)}>
										{currentYear}
									</SelectItem>
									<SelectItem value={String(currentYear - 1)}>
										{currentYear - 1}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button
							disabled={!exportData}
							onClick={() => {
								!!exportData &&
									exportGeneralAssessmentGroupedByDepartment(exportData);
							}}
						>
							Скачать
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Фильтры */}
			<Card>
				<CardContent className="space-y-4 p-6">
					<div className="flex items-center space-x-4">
						{/* Поиск */}
						<div className="w-1/3">
							<Input
								placeholder="Поиск по имени, фамилии или должности..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>

						{/* Фильтр по году */}
						<div className="w-1/3">
							<Select
								value={selectedYear.toString()}
								onValueChange={(value) => setSelectedYear(Number(value))}
							>
								<SelectTrigger>
									<SelectValue placeholder="Выберите год" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={String(currentYear)}>
										{currentYear}
									</SelectItem>
									<SelectItem value={String(currentYear - 1)}>
										{currentYear - 1}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Фильтр по должности */}
						<div className="w-1/3">
							<div className="relative w-full">
								<Button
									variant="outline"
									onClick={() => setShowPositionFilter(!showPositionFilter)}
									className={
										selectedPositions.length > 0
											? 'border-primary w-full'
											: 'w-full'
									}
								>
									<Filter className="w-4 h-4 mr-2" />
									Должности
									{selectedPositions.length > 0 && (
										<Badge variant="secondary" className="ml-2">
											{selectedPositions.length}
										</Badge>
									)}
								</Button>

								{showPositionFilter && (
									<div className="absolute top-full left-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-10 p-4">
										<div className="flex items-center justify-between mb-3">
											<h3 className="font-medium">Фильтр по должностям</h3>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => setShowPositionFilter(false)}
											>
												<X className="w-4 h-4" />
											</Button>
										</div>

										<div className="space-y-2 max-h-60 overflow-y-auto">
											{positions?.map((position) => (
												<div
													key={position}
													className="flex items-center space-x-2"
												>
													<Checkbox
														id={position}
														checked={selectedPositions.includes(position)}
														onCheckedChange={(checked) => {
															if (checked) {
																handlePositionToggle(position);
															} else {
																removePositionFilter(position);
															}
														}}
													/>
													<label
														htmlFor={position}
														className="text-sm cursor-pointer flex-1"
													>
														{position}
													</label>
												</div>
											))}
										</div>

										{selectedPositions.length > 0 && (
											<div className="mt-3 pt-3 border-t">
												<Button
													variant="outline"
													size="sm"
													onClick={clearAllPositionFilters}
													className="w-full bg-transparent"
												>
													Очистить все
												</Button>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Активные фильтры */}
					{selectedPositions.length > 0 && (
						<div className="flex flex-wrap gap-2">
							<span className="text-sm text-muted-foreground">Должности:</span>
							{selectedPositions.map((position) => (
								<Badge
									key={position}
									variant="secondary"
									className="flex items-center gap-1"
								>
									{position}
									<Button
										variant="ghost"
										size="sm"
										className="h-auto p-0 hover:bg-transparent"
										onClick={() => removePositionFilter(position)}
									>
										<X className="w-3 h-3" />
									</Button>
								</Badge>
							))}
							<Badge
								variant="destructive"
								className="flex items-center h-auto p-0 px-4 text-xs gap-1 cursor-pointer"
								onClick={clearAllPositionFilters}
							>
								Очистить все
							</Badge>
						</div>
					)}

					{selectedUserIds.length > 0 && <Separator />}

					{/* Bulk Actions */}
					{selectedUserIds.length > 0 && (
						<div className="flex flex-col justify-start space-x-4 p-4 bg-muted/50 rounded-lg space-y-4">
							<span className="text-sm font-medium">
								Выбрано пользователей: {selectedUserIds.length}
							</span>

							<div className={'flex flex-row justify-between'}>
								<div>
									<Select
										value={bulkEvaluationType}
										onValueChange={(value: AssessmentType) => {
											if (value !== AssessmentType.NONE) {
												setBulkEvaluationType(value);
											}
										}}
									>
										<SelectTrigger className="w-48">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={AssessmentType.FULL}>
												Полная оценка
											</SelectItem>
											<SelectItem value={AssessmentType.SIMPLIFIED}>
												Упрощенная оценка
											</SelectItem>
											<SelectItem value={AssessmentType.NONE}>
												Не назначена
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<DatePickerPopover
										value={startDate}
										onChange={setStartDate}
										title={'Введите дату начала'}
									/>
								</div>
								<div>
									<DatePickerPopover
										value={dueDate}
										onChange={setDueDate}
										title={'Введите дату окончания'}
									/>
								</div>
							</div>

							<Button
								onClick={handleBulkEvaluationTypeChange}
								disabled={bulkAssessmentLoading}
							>
								Применить ко всем выбранным
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Список пользователей */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Список пользователей</CardTitle>
						<div className="flex items-center space-x-2">
							<Checkbox
								checked={
									users.length > 0 && selectedUserIds.length === users.length
								}
								onCheckedChange={(checked) => handleSelectAll(!!checked)}
							/>
							<span className="text-sm">Выбрать всех</span>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-3 overflow-y-auto max-h-[60vh]">
						{filteredUsers.map((user) => {
							const assessmentForYear = user.assessment?.find(
								(assessment) => assessment.year === selectedYear,
							);
							const assessmentType =
								assessmentForYear?.type || AssessmentType.NONE;

							return (
								<div
									key={user.id}
									className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
								>
									<div className="flex items-center space-x-4">
										<Checkbox
											checked={selectedUserIds.includes(user.id)}
											onCheckedChange={(checked) =>
												handleUserSelect(user.id, !!checked)
											}
										/>
										<div>
											<div className="font-medium">
												{user.name} {user.surname}
											</div>
											<div className="text-sm text-muted-foreground">
												{user.position?.title}
											</div>
										</div>
									</div>

									<div className="flex items-center space-x-4">
										{getAssessmentStatusBadge(assessmentForYear?.status)}
										{getAssessmentTypeBadge(assessmentType)}
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
