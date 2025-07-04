'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/common/Loader/Loader';
import { Download } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, isAfter, isBefore } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ExtendedUserData } from '@/types/entities';
import { exportDataToCsv } from '@/lib/exportToCsv';
import { DateRangePicker } from '@/components/common/DateRangePicker/DateRangePicker';
import { DateRange } from 'react-day-picker';

// Define types for report data
interface TestReportItem {
	id: string;
	employee: string;
	department: string;
	position: string;
	testName: string;
	score: number | null;
	percentage: number | null;
	status: 'Назначен' | 'В процессе' | 'Пройден' | 'Не пройден';
	assignmentDate: string | null;
	completionDate: string | null;
	testType: 'Незавершенный тест' | 'Завершенный тест';
}

interface AdaptationReportItem {
	id: string;
	employee: string;
	department: string;
	position: string;
	startDate: string;
	assignmentDate: string | null;
	completionDate: string | null;
	status: 'Адаптация завершена' | 'Адаптация в процессе';
}

interface MaterialReportItem {
	id: string;
	employee: string;
	department: string;
	position: string;
	materialName: string;
	assignmentDate: string | null;
	completionDate: string | null;
	status: 'Изучен' | 'Не изучен';
}

const testColumnsConfig = [
	{ key: 'employee', title: 'ФИО сотрудника' },
	{ key: 'department', title: 'Подразделение' },
	{ key: 'position', title: 'Должность' },
	{ key: 'testName', title: 'Название теста' },
	{ key: 'score', title: 'Баллы' },
	{ key: 'percentage', title: '%' },
	{ key: 'testType', title: 'Тип теста' },
	{ key: 'assignmentDate', title: 'Дата назначения' },
	{ key: 'completionDate', title: 'Дата завершения' },
	{ key: 'status', title: 'Статус' },
];

const materialColumnsConfig = [
	{ key: 'employee', title: 'ФИО сотрудника' },
	{ key: 'department', title: 'Подразделение' },
	{ key: 'position', title: 'Должность' },
	{ key: 'materialName', title: 'Название уч.материала/ЛД' },
	{ key: 'assignmentDate', title: 'Дата назначения' },
	{ key: 'completionDate', title: 'Дата завершения' },
	{ key: 'status', title: 'Статус' },
];

const adaptationColumnsConfig = [
	{ key: 'employee', title: 'ФИО сотрудника' },
	{ key: 'department', title: 'Подразделение' },
	{ key: 'position', title: 'Должность' },
	{ key: 'startDate', title: 'Дата приема' },
	{ key: 'assignmentDate', title: 'Дата назначения' },
	{ key: 'completionDate', title: 'Дата завершения' },
	{ key: 'status', title: 'Статус' },
];

type ReportType = 'tests' | 'materials' | 'adaptation';
type StatusType = 'in_progress' | 'finished' | 'all';
const statusOptions: { title: string; value: StatusType }[] = [
	{ title: 'Все', value: 'all' as StatusType },
	{ title: 'В процессе', value: 'in_progress' as StatusType },
	{ title: 'Завершено', value: 'finished' as StatusType },
];

export default function ReportsTab({
	departmentUsers,
	isLoading,
}: {
	departmentUsers: ExtendedUserData[] | undefined;
	isLoading: boolean;
}) {
	const [reportType, setReportType] = useState<ReportType>('tests');
	const [selectedStatus, setSelectedStatus] = useState<StatusType>('all');
	const [selectedUser, setSelectedUser] = useState('all');

	const state = useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	});

	const userOptions = useMemo(() => {
		if (!departmentUsers || departmentUsers.length === 0) return [];

		return [
			{ id: 'all', name: 'Все пользователи' },
			...departmentUsers.map((user) => ({
				id: user.id,
				name: `${user.name} ${user.surname}${user.patronymic ? ' ' + user.patronymic : ''}`,
			})),
		];
	}, [departmentUsers]);

	const testReportData = useMemo<TestReportItem[]>(() => {
		if (!departmentUsers || departmentUsers.length === 0) return [];
		const testData: TestReportItem[] = [];

		// Process each user
		departmentUsers.forEach((user) => {
			if (selectedUser !== 'all' && user.id !== selectedUser) return;
			const fullName = `${user.name} ${user.surname}${user.patronymic ? ' ' + user.patronymic : ''}`;

			// Check if user has assignments
			if (
				user.userPanel?.assignments &&
				user.userPanel.assignments.length > 0
			) {
				// Filter assignments with surveys
				const surveyAssignments = user.userPanel.assignments
					.filter(
						(assignment) =>
							assignment.surveyId !== null && assignment.survey !== null,
					)
					.filter((a) => {
						if (selectedStatus === 'all') {
							return true;
						}
						if (selectedStatus === 'in_progress' && !a.completedAt) {
							return true;
						}
						return !!(selectedStatus === 'finished' && a.completedAt);
					})
					.filter((a) => {
						if (!state[0]?.from || !state[0]?.to) {
							return true;
						}
						if (
							a?.createdAt &&
							state[0]?.from &&
							isAfter(a?.createdAt, state[0]?.from) &&
							a?.dueDate &&
							state[0]?.to &&
							isBefore(a?.dueDate, state[0]?.to)
						) {
							return true;
						}
						return false;
					});

				if (surveyAssignments.length > 0) {
					// Process each survey assignment
					surveyAssignments.forEach((assignment) => {
						// For each survey, create a test report item
						testData.push({
							id: assignment.id,
							employee: fullName,
							department: user.department?.title || '',
							position: user.position?.title || '',
							testName: assignment.survey?.title || 'Неизвестный тест',
							score: assignment?.survey?.testResults?.score || null,
							percentage: assignment?.survey?.testResults?.score || null,
							status: assignment.completedAt
								? 'Пройден'
								: assignment.startDate && !assignment.completedAt
									? 'В процессе'
									: 'Назначен',
							testType: assignment.completedAt
								? 'Завершенный тест'
								: 'Незавершенный тест',
							assignmentDate: assignment?.createdAt
								? format(new Date(assignment?.createdAt), 'dd.MM.yyyy', {
										locale: ru,
									})
								: '',
							completionDate: assignment?.dueDate
								? format(new Date(assignment?.dueDate), 'dd.MM.yyyy', {
										locale: ru,
									})
								: '',
						});
					});
				}
			}
		});

		return testData;
	}, [departmentUsers, selectedUser, state]);
	const adaptationReportData = useMemo<AdaptationReportItem[]>(() => {
		if (!departmentUsers || departmentUsers.length === 0) return [];
		const adaptationData: AdaptationReportItem[] = [];

		// Process each user
		departmentUsers.forEach((user) => {
			if (selectedUser !== 'all' && user.id !== selectedUser) return;
			const fullName = `${user.name} ${user.surname}${user.patronymic ? ' ' + user.patronymic : ''}`;

			// Check if user has assignments
			if (
				user.userPanel?.assignments &&
				user.userPanel.assignments.length > 0
			) {
				// Filter assignments with adaptation plans
				const adaptationAssignments = user.userPanel.assignments
					.filter(
						(assignment) =>
							assignment.adaptationPlanId !== null &&
							assignment.adaptationPlan !== null,
					)
					.filter((a) => {
						if (selectedStatus === 'all') {
							return true;
						}
						if (selectedStatus === 'in_progress' && !a.completedAt) {
							return true;
						}
						return !!(selectedStatus === 'finished' && a.completedAt);
					})
					.filter((a) => {
						if (!state[0]?.from || !state[0]?.to) {
							return true;
						}
						if (
							a?.startDate &&
							state[0]?.from &&
							isAfter(a?.startDate, state[0]?.from) &&
							a?.dueDate &&
							state[0]?.to &&
							isBefore(a?.dueDate, state[0]?.to)
						) {
							return true;
						}
						return false;
					});

				if (adaptationAssignments.length > 0) {
					// Process each adaptation assignment
					adaptationAssignments.forEach((assignment) => {
						adaptationData.push({
							id: assignment.id,
							employee: fullName,
							department: user.department?.title || '',
							position: user.position?.title || '',
							startDate: user?.startDate
								? format(new Date(user?.startDate || ''), 'dd.MM.yyyy', {
										locale: ru,
									})
								: '',
							assignmentDate: assignment?.createdAt
								? format(new Date(assignment?.createdAt), 'dd.MM.yyyy', {
										locale: ru,
									})
								: '',
							completionDate: assignment?.dueDate
								? format(new Date(assignment?.dueDate), 'dd.MM.yyyy', {
										locale: ru,
									})
								: '',
							status: assignment.completedAt
								? 'Адаптация завершена'
								: 'Адаптация в процессе',
						});
					});
				}
			}
		});

		return adaptationData;
	}, [departmentUsers, selectedStatus, selectedUser, state]);

	const materialsReportData = useMemo<MaterialReportItem[]>(() => {
		if (!departmentUsers || departmentUsers.length === 0) return [];
		const materialsData: MaterialReportItem[] = [];

		// Process each user
		departmentUsers.forEach((user) => {
			if (selectedUser !== 'all' && user.id !== selectedUser) return;

			const fullName = `${user.name} ${user.surname}${user.patronymic ? ' ' + user.patronymic : ''}`;

			// Check if user has assignments
			if (
				user.userPanel?.assignments &&
				user.userPanel.assignments.length > 0
			) {
				// Filter assignments with materials
				const materialAssignments = user.userPanel.assignments
					.filter(
						(assignment) =>
							assignment.materialId !== null && assignment.material !== null,
					)
					.filter((a) => {
						if (selectedStatus === 'all') {
							return true;
						}
						if (selectedStatus === 'in_progress' && !a.completedAt) {
							return true;
						}
						return !!(selectedStatus === 'finished' && a.completedAt);
					})
					.filter((a) => {
						if (!state[0]?.from || !state[0]?.to) {
							return true;
						}
						if (
							a?.startDate &&
							state[0]?.from &&
							isAfter(a?.startDate, state[0]?.from) &&
							a?.dueDate &&
							state[0]?.to &&
							isBefore(a?.dueDate, state[0]?.to)
						) {
							return true;
						}
						return false;
					});

				if (materialAssignments.length > 0) {
					// Process each material assignment
					materialAssignments.forEach((assignment) => {
						materialsData.push({
							id: assignment.id,
							employee: fullName,
							department: user.department?.title || '',
							position: user.position?.title || '',
							materialName:
								assignment.material?.title || 'Неизвестный материал',
							assignmentDate: assignment?.createdAt
								? format(new Date(assignment?.createdAt), 'dd.MM.yyyy', {
										locale: ru,
									})
								: '',
							completionDate: assignment?.dueDate
								? format(new Date(assignment?.dueDate), 'dd.MM.yyyy', {
										locale: ru,
									})
								: '',
							status: assignment?.completedAt ? 'Изучен' : 'Не изучен',
						});
					});
				}
			}
		});
		return materialsData;
	}, [departmentUsers, selectedUser, state]);

	const handleExportReport = () => {
		if (reportType === 'tests') {
			exportDataToCsv(testColumnsConfig, testReportData, `tests-report.csv`);
		} else if (reportType === 'materials') {
			exportDataToCsv(
				materialColumnsConfig,
				materialsReportData,
				`materials-report.csv`,
			);
		} else if (reportType === 'adaptation') {
			exportDataToCsv(
				adaptationColumnsConfig,
				adaptationReportData,
				`adaptation-report.csv`,
			);
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Loader />
			</div>
		);
	}

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<div className="text-xl font-medium">Отчеты</div>
				<div className="flex items-center gap-4">
					<Button variant="outline" onClick={handleExportReport}>
						<Download className="h-4 w-4 mr-2" />
						Экспорт в CSV
					</Button>
				</div>
			</div>

			<div className="flex flex-col gap-6">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle>Фильтры</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-4">
							<div className="w-[200px]">
								<label className="text-sm font-medium mb-1 block">
									Тип отчета
								</label>
								<Select
									value={reportType}
									onValueChange={(value) => setReportType(value as ReportType)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Выберите тип отчета" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="tests">Тесты и опросы</SelectItem>
										<SelectItem value="materials">Учебные материалы</SelectItem>
										<SelectItem value="adaptation">Адаптация</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="w-[250px]">
								<label className="text-sm font-medium mb-1 block">
									Сотрудник
								</label>
								<Select value={selectedUser} onValueChange={setSelectedUser}>
									<SelectTrigger>
										<SelectValue placeholder="Выберите сотрудника" />
									</SelectTrigger>
									<SelectContent>
										{userOptions.map((user) => (
											<SelectItem key={user.id} value={user.id}>
												{user.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="w-[250px]">
								<label className="text-sm font-medium mb-1 block">Статус</label>
								<Select
									value={selectedStatus}
									onValueChange={(value) =>
										setSelectedStatus(value as StatusType)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Выберите статус" />
									</SelectTrigger>
									<SelectContent>
										{statusOptions.map((status) => (
											<SelectItem key={status.value} value={status.value}>
												{status.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="w-[250px]">
								<label className="text-sm font-medium mb-1 block">
									Диапазон
								</label>
								<DateRangePicker state={state} />
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Detailed Reports Section */}
				<Card>
					<CardHeader>
						<CardTitle>
							{reportType === 'tests' &&
								'Отчет завершенные и незавершенные тесты'}
							{reportType === 'adaptation' && 'Отчет по адаптации'}
							{reportType === 'materials' &&
								'Отчет по пройденному обучению (назначенным уч.материалам)'}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{reportType === 'tests' && (
							<div className="rounded-md border overflow-hidden">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="font-semibold">
												ФИО сотрудника
											</TableHead>
											<TableHead className="font-semibold">
												Подразделение
											</TableHead>
											<TableHead className="font-semibold">Должность</TableHead>
											<TableHead className="font-semibold">
												Название теста
											</TableHead>
											<TableHead className="font-semibold">Баллы</TableHead>
											<TableHead className="font-semibold">%</TableHead>
											<TableHead className="font-semibold">Тип теста</TableHead>
											<TableHead className="font-semibold">
												Дата назначения
											</TableHead>
											<TableHead className="font-semibold">
												Дата завершения
											</TableHead>
											<TableHead className="font-semibold">Статус</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{testReportData.map((item) => (
											<TableRow key={item.id}>
												<TableCell>{item.employee}</TableCell>
												<TableCell>{item.department}</TableCell>
												<TableCell>{item.position}</TableCell>
												<TableCell>{item.testName}</TableCell>
												<TableCell>{item.score || '-'}</TableCell>
												<TableCell>{item.percentage || '-'}</TableCell>
												<TableCell>{item.testType}</TableCell>
												<TableCell>{item.assignmentDate}</TableCell>
												<TableCell>{item.completionDate}</TableCell>
												<TableCell>
													<Badge
														className={
															item.status === 'Пройден'
																? 'bg-green-100 text-green-800 hover:bg-green-100'
																: item.status === 'В процессе'
																	? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
																	: item.status === 'Назначен'
																		? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
																		: 'bg-red-100 text-red-800 hover:bg-red-100'
														}
													>
														{item.status}
													</Badge>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}

						{reportType === 'adaptation' && (
							<div className="rounded-md border overflow-hidden">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="font-semibold">
												ФИО сотрудника
											</TableHead>
											<TableHead className="font-semibold">
												Подразделение
											</TableHead>
											<TableHead className="font-semibold">Должность</TableHead>
											<TableHead className="font-semibold">
												Дата приема
											</TableHead>
											<TableHead className="font-semibold">
												Дата назначения
											</TableHead>
											<TableHead className="font-semibold">
												Дата завершения
											</TableHead>
											<TableHead className="font-semibold">Статус</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{adaptationReportData.map((item) => (
											<TableRow key={item.id}>
												<TableCell>{item.employee}</TableCell>
												<TableCell>{item.department}</TableCell>
												<TableCell>{item.position}</TableCell>
												<TableCell>{item.startDate}</TableCell>
												<TableCell>{item.assignmentDate}</TableCell>
												<TableCell>{item.completionDate}</TableCell>
												<TableCell>
													<Badge
														className={
															item.status === 'Адаптация завершена'
																? 'bg-green-100 text-green-800 hover:bg-green-100'
																: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
														}
													>
														{item.status}
													</Badge>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}

						{reportType === 'materials' && (
							<div className="rounded-md border overflow-hidden">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="font-semibold">
												ФИО сотрудника
											</TableHead>
											<TableHead className="font-semibold">
												Подразделение
											</TableHead>
											<TableHead className="font-semibold">Должность</TableHead>
											<TableHead className="font-semibold">
												Название уч.материала/ЛД
											</TableHead>
											<TableHead className="font-semibold">
												Дата назначения
											</TableHead>
											<TableHead className="font-semibold">
												Дата завершения
											</TableHead>
											<TableHead className="font-semibold">Статус</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{materialsReportData.map((item) => (
											<TableRow key={item.id}>
												<TableCell>{item.employee}</TableCell>
												<TableCell>{item.department}</TableCell>
												<TableCell>{item.position}</TableCell>
												<TableCell>{item.materialName}</TableCell>
												<TableCell>
													{item.assignmentDate ? item.assignmentDate : '-'}
												</TableCell>
												<TableCell>
													{item.completionDate ? item.completionDate : '-'}
												</TableCell>
												<TableCell>
													<Badge
														className={
															item.status === 'Изучен'
																? 'bg-green-100 text-green-800 hover:bg-green-100'
																: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
														}
													>
														{item.status}
													</Badge>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
