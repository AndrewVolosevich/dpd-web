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
import { Search, Plus, Users, BarChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '@/components/common/Loader/Loader';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { Routes } from '@/const/routes';
import { AssignTestModal } from '../Modals/AssignTestModal';
import { TestResultsModal } from '../Modals/TestResultsModal';

export default function TestsTab() {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTest, setSelectedTest] = useState<any>(null);
	const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
	const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

	const router = useRouter();

	// Fetch tests
	const { data: tests = [], isLoading } = useQuery({
		queryKey: ['supervisor-tests'],
		queryFn: async () => {
			// In a real implementation, you would fetch from your API
			// const response = await api.get("/api/supervisor/tests")
			// return response.data

			// Mock data for demonstration
			return [
				{
					id: '1',
					title: 'Онбординг для новых сотрудников',
					description: 'Базовый тест для проверки знаний новых сотрудников',
					status: 'ACTIVE',
					questionsCount: 15,
					completedCount: 8,
					assignedCount: 12,
					endDate: new Date(
						Date.now() + 30 * 24 * 60 * 60 * 1000,
					).toISOString(),
				},
				{
					id: '2',
					title: 'Техника безопасности',
					description: 'Обязательный ежегодный тест по технике безопасности',
					status: 'ACTIVE',
					questionsCount: 20,
					completedCount: 25,
					assignedCount: 30,
					endDate: new Date(
						Date.now() + 15 * 24 * 60 * 60 * 1000,
					).toISOString(),
				},
				{
					id: '3',
					title: 'Работа с негативно настроенными клиентами',
					description: 'Тест для отдела продаж по работе с трудными клиентами',
					status: 'COMPLETED',
					questionsCount: 10,
					completedCount: 15,
					assignedCount: 15,
					endDate: new Date(
						Date.now() - 10 * 24 * 60 * 60 * 1000,
					).toISOString(),
				},
				{
					id: '4',
					title: 'SALES БАТТЛЫ 2020',
					description: 'Соревнование между сотрудниками отдела продаж',
					status: 'DRAFT',
					questionsCount: 25,
					completedCount: 0,
					assignedCount: 0,
					endDate: null,
				},
			];
		},
	});

	// Filter tests based on search query
	const filteredTests = tests.filter(
		(test) =>
			test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			test.description.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleCreateTest = () => {
		router.push(`${Routes.ADMIN}/surveys/create`);
	};

	const handleAssignTest = (test: any) => {
		setSelectedTest(test);
		setIsAssignModalOpen(true);
	};

	const handleViewResults = (test: any) => {
		setSelectedTest(test);
		setIsResultsModalOpen(true);
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'ACTIVE':
				return <Badge className="bg-green-500">Активный</Badge>;
			case 'COMPLETED':
				return <Badge className="bg-blue-500">Завершен</Badge>;
			case 'DRAFT':
				return <Badge variant="outline">Черновик</Badge>;
			default:
				return null;
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
				<div className="text-xl font-medium">Тесты и опросы</div>
				<div className="flex items-center gap-4">
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Поиск тестов..."
							className="pl-8 w-[250px]"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<Button onClick={handleCreateTest}>
						<Plus className="h-4 w-4 mr-2" />
						Создать тест
					</Button>
				</div>
			</div>

			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[300px]">Название</TableHead>
							<TableHead>Статус</TableHead>
							<TableHead>Вопросов</TableHead>
							<TableHead>Прошли / Назначено</TableHead>
							<TableHead>Срок</TableHead>
							<TableHead className="text-right">Действия</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredTests.map((test) => (
							<TableRow key={test.id}>
								<TableCell className="font-medium">
									<div>{test.title}</div>
									<div className="text-xs text-muted-foreground">
										{test.description}
									</div>
								</TableCell>
								<TableCell>{getStatusBadge(test.status)}</TableCell>
								<TableCell>{test.questionsCount}</TableCell>
								<TableCell>
									{test.completedCount} / {test.assignedCount}
								</TableCell>
								<TableCell>
									{test.endDate
										? format(new Date(test.endDate), 'dd MMMM yyyy', {
												locale: ru,
											})
										: 'Не указан'}
								</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleAssignTest(test)}
											disabled={test.status !== 'ACTIVE'}
											title="Назначить сотрудникам"
										>
											<Users className="h-4 w-4" />
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleViewResults(test)}
											disabled={test.completedCount === 0}
											title="Просмотр результатов"
										>
											<BarChart className="h-4 w-4" />
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												router.push(`${Routes.ADMIN}/surveys/${test.id}`)
											}
											title="Редактировать тест"
										>
											Редактировать
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}

						{filteredTests.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center py-8 text-muted-foreground"
								>
									{searchQuery ? 'Тесты не найдены' : 'Нет доступных тестов'}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</Card>

			{selectedTest && (
				<>
					<AssignTestModal
						isOpen={isAssignModalOpen}
						onClose={() => setIsAssignModalOpen(false)}
					/>
					<TestResultsModal
						isOpen={isResultsModalOpen}
						onClose={() => setIsResultsModalOpen(false)}
						test={selectedTest}
					/>
				</>
			)}
		</div>
	);
}
