'use client';

import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Plus, FileText, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '@/components/common/Loader/Loader';
import { format, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CreateAdaptationPlanModal } from '../Modals/CreateAdaptationPlanModal';
import { EditAdaptationPlanModal } from '../Modals/EditAdaptationPlanModal';
import { DeleteAdaptationPlanModal } from '../Modals/DeleteAdaptationPlanModal';
import { ViewAdaptationPlanModal } from '../Modals/ViewAdaptationPlanModal';

export default function AdaptationTab() {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
	const [selectedPlan, setSelectedPlan] = useState<any>(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);

	// Fetch employees with adaptation plans
	const { data: employees = [], isLoading } = useQuery({
		queryKey: ['adaptation-employees'],
		queryFn: async () => {
			// In a real implementation, you would fetch from your API
			// const response = await api.get("/api/supervisor/adaptation")
			// return response.data

			// Mock data for demonstration
			return [
				{
					id: '1',
					name: 'Белая',
					surname: 'Алина',
					patronymic: 'Андреевна',
					department: 'Коммерция',
					position: 'Специалист по продажам',
					startDate: '2023-01-15',
					adaptationPlan: {
						id: 'plan1',
						fileUrl: '#',
						fileName: 'План адаптации - Белая А.А.docx',
						uploadedAt: '2023-01-16T10:30:00Z',
						status: 'IN_PROGRESS',
						endDate: '2023-04-15',
					},
				},
				{
					id: '2',
					name: 'Гижук',
					surname: 'Екатерина',
					patronymic: 'Евгеньевна',
					department: 'Отдел продаж',
					position: 'Специалист по продажам',
					startDate: '2022-05-20',
					adaptationPlan: {
						id: 'plan2',
						fileUrl: '#',
						fileName: 'План адаптации - Гижук Е.Е.docx',
						uploadedAt: '2022-05-21T14:15:00Z',
						status: 'COMPLETED',
						endDate: '2022-08-20',
					},
				},
				{
					id: '3',
					name: 'Гуцалова',
					surname: 'Елена',
					patronymic: '',
					department: 'Коммерция',
					position: 'Специалист по продажам',
					startDate: '2023-03-10',
					adaptationPlan: null,
				},
				{
					id: '5',
					name: 'Дубина',
					surname: 'Дмитрий',
					patronymic: '',
					department: 'Коммерция',
					position: 'Ведущий менеджер',
					startDate: '2023-04-01',
					adaptationPlan: {
						id: 'plan3',
						fileUrl: '#',
						fileName: 'План адаптации - Дубина Д.docx',
						uploadedAt: '2023-04-02T09:45:00Z',
						status: 'IN_PROGRESS',
						endDate: '2023-07-01',
					},
				},
			];
		},
	});

	// Filter employees based on search query
	const filteredEmployees = employees.filter(
		(employee) =>
			employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			employee.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
			employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
			employee.position.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleCreatePlan = (employee: any) => {
		setSelectedEmployee(employee);
		setIsCreateModalOpen(true);
	};

	const handleEditPlan = (employee: any) => {
		setSelectedEmployee(employee);
		setSelectedPlan(employee.adaptationPlan);
		setIsEditModalOpen(true);
	};

	const handleDeletePlan = (employee: any) => {
		setSelectedEmployee(employee);
		setSelectedPlan(employee.adaptationPlan);
		setIsDeleteModalOpen(true);
	};

	const handleViewPlan = (employee: any) => {
		setSelectedEmployee(employee);
		setSelectedPlan(employee.adaptationPlan);
		setIsViewModalOpen(true);
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'IN_PROGRESS':
				return <Badge className="bg-blue-500">В процессе</Badge>;
			case 'COMPLETED':
				return <Badge className="bg-green-500">Завершен</Badge>;
			case 'NOT_STARTED':
				return <Badge variant="outline">Не начат</Badge>;
			default:
				return null;
		}
	};

	const getAdaptationProgress = (employee: any) => {
		if (!employee.adaptationPlan) return null;

		const startDate = new Date(employee.startDate);
		const endDate = new Date(employee.adaptationPlan.endDate);
		const today = new Date();

		const totalDays = differenceInDays(endDate, startDate);
		const passedDays = differenceInDays(today, startDate);

		const progress = Math.min(
			Math.max(Math.round((passedDays / totalDays) * 100), 0),
			100,
		);

		return (
			<div className="w-full">
				<div className="flex justify-between text-xs mb-1">
					<span>{progress}%</span>
					<span>{differenceInDays(endDate, today)} дней осталось</span>
				</div>
				<div className="w-full bg-muted rounded-full h-2">
					<div
						className="bg-primary h-2 rounded-full"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
		);
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
				<div className="text-xl font-medium">Адаптация сотрудников</div>
				<div className="flex items-center gap-4">
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Поиск сотрудников..."
							className="pl-8 w-[250px]"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>
			</div>

			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[250px]">Сотрудник</TableHead>
							<TableHead>Должность</TableHead>
							<TableHead>Дата начала работы</TableHead>
							<TableHead>План адаптации</TableHead>
							<TableHead>Прогресс</TableHead>
							<TableHead className="text-right">Действия</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredEmployees.map((employee) => (
							<TableRow key={employee.id}>
								<TableCell className="font-medium">
									{employee.surname} {employee.name} {employee.patronymic}
								</TableCell>
								<TableCell>{employee.position}</TableCell>
								<TableCell>
									{format(new Date(employee.startDate), 'dd MMMM yyyy', {
										locale: ru,
									})}
								</TableCell>
								<TableCell>
									{employee.adaptationPlan ? (
										<div className="flex items-center gap-2">
											<FileText className="h-4 w-4" />
											<span className="text-sm truncate max-w-[200px]">
												{employee.adaptationPlan.fileName}
											</span>
											{getStatusBadge(employee.adaptationPlan.status)}
										</div>
									) : (
										<span className="text-muted-foreground">Не загружен</span>
									)}
								</TableCell>
								<TableCell>
									{employee.adaptationPlan?.status === 'IN_PROGRESS' &&
										getAdaptationProgress(employee)}
								</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end gap-2">
										{employee.adaptationPlan ? (
											<>
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleViewPlan(employee)}
													title="Просмотреть план"
												>
													<FileText className="h-4 w-4" />
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleEditPlan(employee)}
													title="Редактировать план"
												>
													<Pencil className="h-4 w-4" />
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleDeletePlan(employee)}
													title="Удалить план"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</>
										) : (
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleCreatePlan(employee)}
											>
												<Plus className="h-4 w-4 mr-2" />
												Добавить план
											</Button>
										)}
									</div>
								</TableCell>
							</TableRow>
						))}

						{filteredEmployees.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center py-8 text-muted-foreground"
								>
									{searchQuery
										? 'Сотрудники не найдены'
										: 'У вас нет подчиненных сотрудников'}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</Card>

			{selectedEmployee && (
				<>
					<CreateAdaptationPlanModal
						isOpen={isCreateModalOpen}
						onClose={() => setIsCreateModalOpen(false)}
						employee={selectedEmployee}
					/>
					{selectedPlan && (
						<>
							<EditAdaptationPlanModal
								isOpen={isEditModalOpen}
								onClose={() => setIsEditModalOpen(false)}
								employee={selectedEmployee}
								plan={selectedPlan}
							/>
							<DeleteAdaptationPlanModal
								isOpen={isDeleteModalOpen}
								onClose={() => setIsDeleteModalOpen(false)}
								employee={selectedEmployee}
								plan={selectedPlan}
							/>
							<ViewAdaptationPlanModal
								isOpen={isViewModalOpen}
								onClose={() => setIsViewModalOpen(false)}
								employee={selectedEmployee}
								plan={selectedPlan}
							/>
						</>
					)}
				</>
			)}
		</div>
	);
}
