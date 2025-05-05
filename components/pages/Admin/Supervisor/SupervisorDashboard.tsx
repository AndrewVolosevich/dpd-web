'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { Routes } from '@/const/routes';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ClipboardList, FileText, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TestAssignmentModal } from './TestAssignmentModal';
import { TestResultsTable } from './TestResultsTable';

export default function SupervisorDashboard() {
	const [activeTab, setActiveTab] = useState('tests');
	const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
	const [selectedTest, setSelectedTest] = useState<string | null>(null);
	const router = useRouter();
	const api = useApi();

	// Fetch tests
	const { data: tests = [] } = useQuery({
		queryKey: ['supervisor-tests'],
		queryFn: async () => {
			const resp = await api.get(`/surveys?surveyVariant=TEST`);
			return resp?.data || [];
		},
	});

	// Fetch users
	const { data: users = [] } = useQuery({
		queryKey: ['supervisor-users'],
		queryFn: async () => {
			const resp = await api.post(`/auth/get-users`, {});
			return resp?.data || [];
		},
	});

	const handleAssignTest = (testId: string) => {
		setSelectedTest(testId);
		setIsAssignModalOpen(true);
	};

	const handleViewResults = (testId: string) => {
		router.push(`${Routes.ADMIN}/results/${testId}`);
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

	return (
		<div className="container py-6 space-y-6 mx-auto">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Панель руководителя</h1>
				<Button asChild className="bg-primary">
					<a href={`${Routes.ADMIN}/surveys/create`}>Создать тест</a>
				</Button>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList>
					<TabsTrigger value="tests">
						<FileText className="h-4 w-4 mr-2" />
						Тесты
					</TabsTrigger>
					<TabsTrigger value="results">
						<ClipboardList className="h-4 w-4 mr-2" />
						Результаты
					</TabsTrigger>
					<TabsTrigger value="users">
						<Users className="h-4 w-4 mr-2" />
						Сотрудники
					</TabsTrigger>
				</TabsList>

				<TabsContent value="tests" className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{tests.map((test: any) => (
							<Card key={test.id}>
								<CardHeader className="pb-2">
									<div className="flex justify-between items-start">
										<CardTitle className="text-lg">{test.title}</CardTitle>
										{getStatusBadge(test.status)}
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground mb-4 line-clamp-2">
										{test.description}
									</p>
									<div className="text-sm text-muted-foreground mb-4">
										<div>Вопросов: {test.questions.length}</div>
										<div>Прошли тест: {test._count?.responses || 0}</div>
										{test.endDate && (
											<div>
												До:{' '}
												{format(new Date(test.endDate), 'dd MMMM yyyy', {
													locale: ru,
												})}
											</div>
										)}
									</div>
									<div className="flex flex-col space-y-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleAssignTest(test.id)}
											disabled={test.status !== 'ACTIVE'}
										>
											Назначить
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleViewResults(test.id)}
										>
											Результаты
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												router.push(`${Routes.ADMIN}/surveys/${test.id}`)
											}
										>
											Редактировать
										</Button>
									</div>
								</CardContent>
							</Card>
						))}

						{tests.length === 0 && (
							<div className="col-span-full text-center py-12 text-muted-foreground">
								Нет доступных тестов. Создайте новый тест, чтобы начать.
							</div>
						)}
					</div>
				</TabsContent>

				<TabsContent value="results">
					<TestResultsTable />
				</TabsContent>

				<TabsContent value="users">
					<Card>
						<CardHeader>
							<CardTitle>Сотрудники</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{users.map((user: any) => (
									<div
										key={user.id}
										className="flex justify-between items-center border-b pb-2"
									>
										<div>
											<div className="font-medium">
												{user.surname} {user.name}
											</div>
											<div className="text-sm text-muted-foreground">
												{user.position || 'Должность не указана'}
											</div>
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() => router.push(`/profile/${user.id}`)}
										>
											Профиль
										</Button>
									</div>
								))}

								{users.length === 0 && (
									<div className="text-center py-8 text-muted-foreground">
										Нет доступных сотрудников
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{selectedTest && (
				<TestAssignmentModal
					open={isAssignModalOpen}
					onClose={() => setIsAssignModalOpen(false)}
					testId={selectedTest}
				/>
			)}
		</div>
	);
}
