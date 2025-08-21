'use client';

import { useMemo, useRef, useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
	CheckCircle,
	Eye,
	EyeOff,
	FileText,
	Pencil,
	Plus,
	Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/common/Loader/Loader';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CreateAdaptationPlanModal } from '../Modals/CreateAdaptationPlanModal';
import { EditAdaptationPlanModal } from '../Modals/EditAdaptationPlanModal';
import { DeleteAdaptationPlanModal } from '../Modals/DeleteAdaptationPlanModal';
import { CompleteAdaptationModal } from '../Modals/CompleteAdaptationModal';
import { ExtendedUserData } from '@/types/entities';
import { AdaptationStatus, Assignment } from '@/types/education';
import useTemplatesList from '@/lib/api/queries/Education/useTemplatesList';
import Link from 'next/link';
import { useCreateTemplate } from '@/lib/api/queries/Education/mutations/templates/useCreateTemplate';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { useDeleteTemplate } from '@/lib/api/queries/Education/mutations/templates/useDeleteTemplate';

export default function AdaptationTab({
	departmentUsers,
	isLoading,
}: {
	departmentUsers: ExtendedUserData[] | undefined;
	isLoading: boolean;
}) {
	const { isAdmin } = useAuth();
	const [expandedEmployees, setExpandedEmployees] = useState<
		Record<string, boolean>
	>({});
	const [selectedEmployee, setSelectedEmployee] =
		useState<ExtendedUserData | null>(null);
	const [selectedAssignment, setSelectedAssignment] =
		useState<Assignment | null>(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: templates } = useTemplatesList();
	const { mutate: createTemplate } = useCreateTemplate();
	const { mutate: deleteTemplate } = useDeleteTemplate();

	const filteredTemplates = useMemo(() => {
		return templates
			?.filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
			.sort((a, b) => a.name.localeCompare(b.name));
	}, [templates, searchTerm]);

	const getAdaptationUserAssignments = (employee: ExtendedUserData) => {
		return employee?.userPanel?.assignments?.filter((a) => !!a?.adaptationPlan);
	};
	// Modal states
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [completeModalOpen, setCompleteModalOpen] = useState(false);

	const toggleEmployeeExpand = (employeeId: string) => {
		setExpandedEmployees((prev) => ({
			...prev,
			[employeeId]: !prev[employeeId],
		}));
	};

	const handleCreatePlan = (employee: ExtendedUserData) => {
		setSelectedEmployee(employee);
		setCreateModalOpen(true);
	};

	const handleEditPlan = (
		employee: ExtendedUserData,
		assignment: Assignment,
	) => {
		setSelectedEmployee(employee);
		setSelectedAssignment(assignment);
		setEditModalOpen(true);
	};

	const handleDeletePlan = (
		employee: ExtendedUserData,
		assignment: Assignment,
	) => {
		setSelectedEmployee(employee);
		setSelectedAssignment(assignment);
		setDeleteModalOpen(true);
	};

	const handleCompletePlan = (
		employee: ExtendedUserData,
		assignment: Assignment,
	) => {
		setSelectedEmployee(employee);
		setSelectedAssignment(assignment);
		setCompleteModalOpen(true);
	};

	const getStatusBadge = (assignment: Assignment) => {
		if (!assignment?.adaptationPlan) return null;

		const status = assignment?.adaptationPlan?.status;
		let badgeColor: string;
		let badgeLabel: string;

		switch (status) {
			case AdaptationStatus.ASSIGNED:
				badgeColor = 'bg-gray-500';
				badgeLabel = 'Назначен';
				break;

			case AdaptationStatus.ACKNOWLEDGED:
				badgeColor = 'bg-blue-500';
				badgeLabel = 'Ознакомлен';
				break;

			case AdaptationStatus.ASSESSMENT:
				badgeColor = 'bg-yellow-500';
				badgeLabel = 'Готов';
				break;

			case AdaptationStatus.COMPLETED:
				badgeColor = 'bg-green-500';
				badgeLabel = 'Завершен';
				break;

			default:
				badgeColor = 'bg-gray-100';
				badgeLabel = 'Нет данных';
				break;
		}

		return <Badge className={badgeColor}>{badgeLabel}</Badge>;
	};

	const fileInputRef = useRef<HTMLInputElement | null>(null);

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
				<div className="text-xl font-medium">Адаптация сотрудников</div>
			</div>

			{/* Main employees table */}
			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[250px]">Сотрудник</TableHead>
							<TableHead>Должность</TableHead>
							<TableHead>Дата начала работы</TableHead>
							<TableHead>Планы адаптации</TableHead>
							<TableHead className="text-right">Действия</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{departmentUsers?.map((employee) => (
							<TableRow
								key={employee.id}
								className="cursor-pointer hover:bg-muted/50"
							>
								<TableCell className="font-medium">
									<div
										className="flex items-center"
										onClick={() => toggleEmployeeExpand(employee.id)}
									>
										{expandedEmployees[employee.id] ? (
											<EyeOff className="h-4 w-4 inline mr-2" />
										) : (
											<Eye className="h-4 w-4 inline mr-2" />
										)}
										{employee.surname} {employee.name} {employee.patronymic}
									</div>
								</TableCell>
								<TableCell>{employee?.position?.title}</TableCell>
								<TableCell>
									{format(new Date(employee?.startDate || ''), 'dd MMMM yyyy', {
										locale: ru,
									})}
								</TableCell>
								<TableCell>
									{getAdaptationUserAssignments(employee)?.length ? (
										<span>
											{getAdaptationUserAssignments(employee)?.length} план(ов)
										</span>
									) : (
										<span className="text-muted-foreground">Нет планов</span>
									)}
								</TableCell>
								<TableCell className="text-right">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleCreatePlan(employee)}
									>
										<Plus className="h-4 w-4 mr-2" />
										Добавить план
									</Button>
								</TableCell>
							</TableRow>
						))}

						{departmentUsers?.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={5}
									className="text-center py-8 text-muted-foreground"
								>
									У вас нет подчиненных сотрудников
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</Card>

			{/* Expanded employee plans - separate tables for each employee */}
			{departmentUsers?.map((employee) => {
				if (!expandedEmployees[employee.id]) return null;
				const userAssignments = getAdaptationUserAssignments(employee);
				const lastAdaptationAssignment =
					userAssignments[userAssignments.length - 1];

				const getMemo: () => string = () => {
					if (
						lastAdaptationAssignment?.adaptationPlan?.status ===
						AdaptationStatus.ASSIGNED
					) {
						return 'Ожидаем ознакомления сотрудника';
					}
					if (
						lastAdaptationAssignment?.adaptationPlan?.status ===
						AdaptationStatus.ACKNOWLEDGED
					) {
						return 'Обратите внимание - когда до завершения адаптационного периода сотрудника останется 10 дней и менее вам будет необходимо назначить встречу с сотрудником для подведения итогов испытательного срока/обучения. Во время беседы оцените уровень необходимых знаний и навыков для самостоятельной работы, успешность выполнения каждой задачи, а также уровень мотивации сотрудника к работе в компании.';
					}
					if (
						lastAdaptationAssignment?.adaptationPlan?.status ===
						AdaptationStatus.ASSESSMENT
					) {
						return 'После проведения оценочной беседы с сотрудником внесите все оценки в бланк адаптации и нажмите на кнопку «Завершить адаптацию».   ';
					}
					return 'Вы можете подготовить программу адаптации для вашего нового сотрудника на основе существующих шаблонов. Внесите в бланк актуальные данные (фио сотрудника, руководителя, задачи и сроки), сохраните и загрузите файл на портал и отправьте его сотруднику для ознакомления, нажав на кнопку «Добавить план».';
				};
				return (
					<Card
						key={`expanded-${employee.id}`}
						className="mt-6 mb-4 border-t-0 rounded-t-none"
					>
						<div className="p-4">
							<h3 className="text-sm font-medium mb-2">
								Планы адаптации для {employee.surname} {employee.name}
							</h3>

							<div className={'text-sm text-gray-500 mb-4'}>{getMemo()}</div>

							{userAssignments?.length > 0 ? (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Файл плана</TableHead>
											<TableHead>Статус</TableHead>
											<TableHead>Начало адаптации</TableHead>
											<TableHead>Конец адаптации</TableHead>
											<TableHead className="text-right">Действия</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{userAssignments?.map((assignment: Assignment) => (
											<TableRow key={assignment?.adaptationPlan?.id}>
												<TableCell>
													<div className="flex items-center gap-2">
														<FileText className="h-4 w-4" />
														<span className="text-sm truncate max-w-[150px]">
															План адаптации
														</span>
													</div>
												</TableCell>
												<TableCell>{getStatusBadge(assignment)}</TableCell>
												<TableCell>
													{assignment?.startDate
														? format(
																new Date(assignment?.startDate),
																'dd.MM.yyyy',
																{
																	locale: ru,
																},
															)
														: ''}
												</TableCell>
												<TableCell>
													{assignment?.dueDate
														? format(
																new Date(assignment?.dueDate),
																'dd.MM.yyyy',
																{
																	locale: ru,
																},
															)
														: ''}
												</TableCell>

												<TableCell className="text-right">
													<div className="flex justify-end gap-2">
														<Button
															variant="outline"
															size="sm"
															onClick={(e) => {
																e.stopPropagation();
																const fileUrl =
																	assignment?.adaptationPlan?.fileUrl || '';
																const anchor = document.createElement('a');
																anchor.href = fileUrl;
																anchor.download = `план_адаптации_${employee?.name}_${employee?.surname}`;
																anchor.click();
															}}
															tooltip={'Скачать файл'}
														>
															<FileText className="h-4 w-4" />
														</Button>
														{assignment?.adaptationPlan?.status !==
															AdaptationStatus.COMPLETED && (
															<Button
																variant="outline"
																size="sm"
																onClick={(e) => {
																	e.stopPropagation();
																	handleEditPlan(employee, assignment);
																}}
																tooltip="Редактировать план"
															>
																<Pencil className="h-4 w-4" />
															</Button>
														)}
														{assignment?.adaptationPlan?.status ===
															AdaptationStatus.ASSESSMENT && (
															<Button
																variant="outline"
																size="sm"
																className="bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700"
																onClick={(e) => {
																	e.stopPropagation();
																	handleCompletePlan(employee, assignment);
																}}
																tooltip="Завершить адаптацию"
															>
																<CheckCircle className="h-4 w-4" />
															</Button>
														)}
														<Button
															variant="outline"
															size="sm"
															className="bg-red-50 hover:bg-red-100 text-primary hover:text-red-700"
															onClick={(e) => {
																e.stopPropagation();
																handleDeletePlan(employee, assignment);
															}}
															tooltip="Удалить план"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<div className="py-6 text-center text-muted-foreground">
									У сотрудника нет планов адаптации. Нажмите &#34;Добавить
									план&#34; для создания.
								</div>
							)}
						</div>
					</Card>
				);
			})}

			<Card className={'mt-4 p-4'}>
				<div className={'flex justify-between items-center'}>
					<h3 className={'mb-2'}>Шаблоны адаптационных планов</h3>
					{isAdmin && (
						<div>
							<label htmlFor="upload-template" className="cursor-pointer">
								<Button
									variant="outline"
									onClick={() => fileInputRef.current?.click()}
								>
									<Plus className="h-4 w-4 mr-2" />
									Добавить шаблон
								</Button>
							</label>
							<input
								ref={fileInputRef}
								id="upload-template"
								type="file"
								className="hidden"
								accept=".csv,.xlsx,.doc,.docx"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) {
										const formData = new FormData();
										formData.append('file', file, file.name);
										createTemplate(formData);
									}
								}}
							/>
						</div>
					)}
				</div>
				<div className={'mt-2 mb-4 text-gray-500 text-sm'}>Описание</div>
				<div className={'mb-4'}>
					<input
						type="text"
						placeholder="Введите имя для поиска..."
						className="border border-gray-300 rounded px-4 py-2 text-sm w-[50%]"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<div className="max-h-64 overflow-y-auto">
					<Table>
						<TableBody>
							{filteredTemplates?.map((t) => (
								<TableRow key={t.url}>
									<TableCell>
										<Link href={t.url}>
											<div>{t.name}</div>
										</Link>
									</TableCell>
									<TableCell className="text-right">
										{isAdmin && (
											<Button
												variant="ghost"
												size="icon"
												onClick={() => {
													deleteTemplate(t.url);
												}}
												className="text-gray-500 hover:text-red-500"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Card>

			{/* Modals */}
			{selectedEmployee && (
				<>
					<CreateAdaptationPlanModal
						isOpen={createModalOpen}
						onClose={() => setCreateModalOpen(false)}
						employee={selectedEmployee}
					/>

					{selectedAssignment && (
						<>
							<EditAdaptationPlanModal
								isOpen={editModalOpen}
								onClose={() => setEditModalOpen(false)}
								employee={selectedEmployee}
								assignment={selectedAssignment}
							/>

							<DeleteAdaptationPlanModal
								isOpen={deleteModalOpen}
								onClose={() => {
									setDeleteModalOpen(false);
									setSelectedAssignment(null);
								}}
								employee={selectedEmployee}
								assignment={selectedAssignment}
							/>

							<CompleteAdaptationModal
								isOpen={completeModalOpen}
								onClose={() => setCompleteModalOpen(false)}
								employee={selectedEmployee}
								assignment={selectedAssignment}
							/>
						</>
					)}
				</>
			)}
		</div>
	);
}
