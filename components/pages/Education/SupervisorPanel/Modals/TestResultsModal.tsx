'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader } from '@/components/common/Loader/Loader';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
	BarChart,
	PieChart,
	Pie,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	Cell,
	ResponsiveContainer,
} from 'recharts';

interface TestResultsModalProps {
	isOpen: boolean;
	onClose: () => void;
	test: any;
}

export function TestResultsModal({
	isOpen,
	onClose,
	test,
}: TestResultsModalProps) {
	const [activeTab, setActiveTab] = useState('summary');

	// Fetch test results
	const { data: results, isLoading } = useQuery({
		queryKey: ['test-results', test?.id],
		queryFn: async () => {
			// In a real implementation, you would fetch from your API
			// const response = await api.get(`/api/tests/${test.id}/results`)
			// return response.data

			// Mock data for demonstration
			return {
				summary: {
					totalAssigned: 15,
					completed: 10,
					inProgress: 3,
					notStarted: 2,
					averageScore: 82,
					passRate: 90,
					averageTimeMinutes: 18,
				},
				scoreDistribution: [
					{ range: '0-50%', count: 1 },
					{ range: '51-70%', count: 2 },
					{ range: '71-85%', count: 4 },
					{ range: '86-100%', count: 3 },
				],
				questionStats: [
					{
						id: 1,
						question: 'Какие основные ценности компании?',
						correctRate: 95,
					},
					{
						id: 2,
						question: 'Кто является основателем компании?',
						correctRate: 100,
					},
					{
						id: 3,
						question: 'В каком году была основана компания?',
						correctRate: 85,
					},
					{
						id: 4,
						question: 'Какие продукты предлагает компания?',
						correctRate: 90,
					},
					{
						id: 5,
						question: 'Какие методы работы с клиентами рекомендуются?',
						correctRate: 75,
					},
					{
						id: 6,
						question: 'Как правильно оформить заказ в системе?',
						correctRate: 60,
					},
					{
						id: 7,
						question: 'Какие шаги нужно предпринять при жалобе клиента?',
						correctRate: 70,
					},
				],
				userResults: [
					{
						userId: '1',
						name: 'Белая Алина Андреевна',
						department: 'Коммерция',
						status: 'COMPLETED',
						score: 95,
						timeMinutes: 15,
						completedAt: '2023-04-10T14:30:00Z',
					},
					{
						userId: '2',
						name: 'Гижук Екатерина Евгеньевна',
						department: 'Отдел продаж',
						status: 'COMPLETED',
						score: 85,
						timeMinutes: 20,
						completedAt: '2023-04-12T10:15:00Z',
					},
					{
						userId: '3',
						name: 'Гуцалова Елена',
						department: 'Коммерция',
						status: 'COMPLETED',
						score: 75,
						timeMinutes: 25,
						completedAt: '2023-04-15T16:45:00Z',
					},
					{
						userId: '4',
						name: 'Демидова Елена Владимировна',
						department: 'Коммерция',
						status: 'COMPLETED',
						score: 90,
						timeMinutes: 18,
						completedAt: '2023-04-11T11:20:00Z',
					},
					{
						userId: '5',
						name: 'Доморацкий Кирилл Борисович',
						department: 'Коммерция',
						status: 'IN_PROGRESS',
						assignedAt: '2023-04-05T09:30:00Z',
					},
				],
			};
		},
		enabled: isOpen && !!test?.id,
	});

	const formatDate = (dateString: string) => {
		return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: ru });
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'COMPLETED':
				return <Badge className="bg-green-500">Завершено</Badge>;
			case 'IN_PROGRESS':
				return <Badge className="bg-blue-500">В процессе</Badge>;
			case 'NOT_STARTED':
				return <Badge variant="outline">Не начато</Badge>;
			default:
				return null;
		}
	};

	const getScoreColor = (score: number) => {
		if (score >= 85) return 'text-green-500';
		if (score >= 70) return 'text-blue-500';
		if (score >= 50) return 'text-yellow-500';
		return 'text-red-500';
	};

	const COLORS = ['#ff8042', '#ffbb28', '#00C49F', '#0088FE'];

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[800px]">
				<DialogHeader>
					<DialogTitle>Результаты теста: {test?.title}</DialogTitle>
				</DialogHeader>

				{isLoading ? (
					<div className="flex justify-center items-center h-[400px]">
						<Loader />
					</div>
				) : (
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="summary">Сводка</TabsTrigger>
							<TabsTrigger value="questions">Вопросы</TabsTrigger>
							<TabsTrigger value="users">Сотрудники</TabsTrigger>
						</TabsList>

						<TabsContent value="summary" className="mt-4 space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<Card>
									<CardContent className="pt-6">
										<div className="text-2xl font-bold text-center">
											{results?.summary.averageScore}%
										</div>
										<div className="text-sm text-center text-muted-foreground">
											Средний балл
										</div>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="pt-6">
										<div className="text-2xl font-bold text-center">
											{results?.summary.passRate}%
										</div>
										<div className="text-sm text-center text-muted-foreground">
											Процент прохождения
										</div>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="pt-6">
										<div className="text-2xl font-bold text-center">
											{results?.summary.averageTimeMinutes} мин
										</div>
										<div className="text-sm text-center text-muted-foreground">
											Среднее время
										</div>
									</CardContent>
								</Card>
							</div>

							<Card>
								<CardContent className="pt-6">
									<div className="mb-4">
										<div className="text-sm font-medium mb-2">
											Статус прохождения
										</div>
										<div className="grid grid-cols-3 gap-2 text-center">
											<div>
												<div className="text-lg font-semibold">
													{results?.summary.completed}
												</div>
												<div className="text-xs text-muted-foreground">
													Завершено
												</div>
											</div>
											<div>
												<div className="text-lg font-semibold">
													{results?.summary.inProgress}
												</div>
												<div className="text-xs text-muted-foreground">
													В процессе
												</div>
											</div>
											<div>
												<div className="text-lg font-semibold">
													{results?.summary.notStarted}
												</div>
												<div className="text-xs text-muted-foreground">
													Не начато
												</div>
											</div>
										</div>
										<div className="mt-2">
											<Progress
												value={
													results?.summary?.completed &&
													results?.summary?.totalAssigned
														? (results.summary.completed /
																results.summary.totalAssigned) *
															100
														: 0
												}
												className="h-2"
											/>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="pt-6">
									<div className="text-sm font-medium mb-4">
										Распределение результатов
									</div>
									<div className="h-[200px]">
										<ResponsiveContainer width="100%" height="100%">
											<PieChart>
												<Pie
													data={results?.scoreDistribution}
													cx="50%"
													cy="50%"
													labelLine={false}
													outerRadius={80}
													fill="#8884d8"
													dataKey="count"
													label={({ name, percent }) =>
														`${name} (${(percent * 100).toFixed(0)}%)`
													}
												>
													{results?.scoreDistribution.map((entry, index) => (
														<Cell
															key={`cell-${index}`}
															fill={COLORS[index % COLORS.length]}
														/>
													))}
												</Pie>
												<Tooltip />
												<Legend />
											</PieChart>
										</ResponsiveContainer>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="questions" className="mt-4">
							<Card>
								<CardContent className="pt-6">
									<div className="text-sm font-medium mb-4">
										Статистика по вопросам
									</div>
									<div className="h-[300px]">
										<ResponsiveContainer width="100%" height="100%">
											<BarChart
												data={results?.questionStats}
												layout="vertical"
												margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
											>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis type="number" domain={[0, 100]} />
												<YAxis
													dataKey="id"
													type="category"
													tick={({ y, payload }) => {
														const question = results?.questionStats.find(
															(q) => q.id === payload.value,
														)?.question;
														return (
															<text
																x={0}
																y={y}
																dy={4}
																textAnchor="start"
																fontSize={12}
																fill="#666"
															>
																{`${payload.value}. ${question ? `${question.substring(0, 25)}${question.length > 25 ? '...' : ''}` : ''}`}
															</text>
														);
													}}
													width={150}
												/>
												<Tooltip
													formatter={(value) => [
														`${value}% правильных ответов`,
														'Процент',
													]}
													labelFormatter={(value) => {
														const question = results?.questionStats.find(
															(q) => q.id === value,
														)?.question;
														return `Вопрос ${value}: ${question}`;
													}}
												/>
												<Legend />
												<Bar
													dataKey="correctRate"
													name="Процент правильных ответов"
													fill="#8884d8"
												/>
											</BarChart>
										</ResponsiveContainer>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="users" className="mt-4">
							<Card>
								<CardContent className="pt-6">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Сотрудник</TableHead>
												<TableHead>Подразделение</TableHead>
												<TableHead>Статус</TableHead>
												<TableHead>Результат</TableHead>
												<TableHead>Время</TableHead>
												<TableHead>Дата</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{results?.userResults.map((user) => (
												<TableRow key={user.userId}>
													<TableCell className="font-medium">
														{user.name}
													</TableCell>
													<TableCell>{user.department}</TableCell>
													<TableCell>{getStatusBadge(user.status)}</TableCell>
													<TableCell>
														{user.score !== undefined ? (
															<span className={getScoreColor(user.score)}>
																{user.score}%
															</span>
														) : (
															'-'
														)}
													</TableCell>
													<TableCell>
														{user.timeMinutes !== undefined
															? `${user.timeMinutes} мин`
															: '-'}
													</TableCell>
													<TableCell>
														{user.completedAt
															? formatDate(user.completedAt)
															: user.assignedAt
																? formatDate(user.assignedAt)
																: '-'}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				)}

				<DialogFooter>
					<Button onClick={onClose}>Закрыть</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
