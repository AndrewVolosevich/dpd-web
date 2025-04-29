'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '@/components/common/Loader/Loader';
import { BarChart, PieChart, Download } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
// import DatePickerWithRange from '@/components/common/DatePickerPopover/DatePickerPopover';
import { subMonths } from 'date-fns';

export default function ReportsTab() {
	const [reportType, setReportType] = useState('tests');
	const [dateRange, setDateRange] = useState({
		from: subMonths(new Date(), 1),
		to: new Date(),
	});
	const [department, setDepartment] = useState('all');

	// Fetch report data
	const { data: reportData, isLoading } = useQuery({
		queryKey: ['reports', reportType, dateRange, department],
		queryFn: async () => {
			// In a real implementation, you would fetch from your API
			// const response = await api.get(`/api/supervisor/reports/${reportType}`, {
			//   params: {
			//     from: dateRange.from.toISOString(),
			//     to: dateRange.to.toISOString(),
			//     department,
			//   },
			// })
			// return response.data

			// Mock data for demonstration
			return {
				tests: {
					completionRate: 78,
					averageScore: 85,
					totalAssigned: 120,
					totalCompleted: 94,
					byDepartment: [
						{
							name: 'Коммерция',
							assigned: 45,
							completed: 38,
							averageScore: 82,
						},
						{
							name: 'Отдел продаж',
							assigned: 35,
							completed: 30,
							averageScore: 88,
						},
						{
							name: 'Логистика',
							assigned: 25,
							completed: 16,
							averageScore: 79,
						},
						{
							name: 'Маркетинг',
							assigned: 15,
							completed: 10,
							averageScore: 91,
						},
					],
					byTest: [
						{
							name: 'Онбординг',
							assigned: 30,
							completed: 25,
							averageScore: 88,
						},
						{
							name: 'Техника безопасности',
							assigned: 50,
							completed: 45,
							averageScore: 92,
						},
						{
							name: 'Работа с клиентами',
							assigned: 25,
							completed: 15,
							averageScore: 76,
						},
						{
							name: 'Продуктовое обучение',
							assigned: 15,
							completed: 9,
							averageScore: 84,
						},
					],
				},
				materials: {
					totalViews: 256,
					uniqueUsers: 42,
					averageTimeSpent: '18 минут',
					byType: [
						{ type: 'Документ', count: 120, users: 35 },
						{ type: 'Видео', count: 85, users: 28 },
						{ type: 'Презентация', count: 45, users: 20 },
						{ type: 'Вебинар', count: 6, users: 6 },
					],
					mostPopular: [
						{ name: 'Руководство по продажам', views: 45, type: 'Документ' },
						{
							name: 'Презентация новых продуктов',
							views: 38,
							type: 'Презентация',
						},
						{ name: 'Обучение работе с CRM', views: 32, type: 'Видео' },
						{ name: 'Техники продаж', views: 28, type: 'Документ' },
					],
				},
				adaptation: {
					inProgress: 8,
					completed: 12,
					notStarted: 3,
					averageDuration: '75 дней',
					byDepartment: [
						{ name: 'Коммерция', inProgress: 3, completed: 5, notStarted: 1 },
						{
							name: 'Отдел продаж',
							inProgress: 2,
							completed: 4,
							notStarted: 1,
						},
						{ name: 'Логистика', inProgress: 2, completed: 2, notStarted: 0 },
						{ name: 'Маркетинг', inProgress: 1, completed: 1, notStarted: 1 },
					],
				},
			}[reportType];
		},
		enabled: !!reportType,
	});

	const handleExportReport = () => {
		// In a real implementation, you would generate and download a report
		alert('Экспорт отчета в разработке');
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
						Экспорт
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
								<Select value={reportType} onValueChange={setReportType}>
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

							<div className="w-[200px]">
								<label className="text-sm font-medium mb-1 block">
									Подразделение
								</label>
								<Select value={department} onValueChange={setDepartment}>
									<SelectTrigger>
										<SelectValue placeholder="Выберите подразделение" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Все подразделения</SelectItem>
										<SelectItem value="commerce">Коммерция</SelectItem>
										<SelectItem value="sales">Отдел продаж</SelectItem>
										<SelectItem value="logistics">Логистика</SelectItem>
										<SelectItem value="marketing">Маркетинг</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/*<div className="w-[300px]">*/}
							{/*	<label className="text-sm font-medium mb-1 block">Период</label>*/}
							{/*	<DatePickerWithRange*/}
							{/*		value={{*/}
							{/*			from: dateRange?.from ?? undefined,*/}
							{/*			to: dateRange?.to ?? undefined,*/}
							{/*		}}*/}
							{/*		onChange={(range) => {*/}
							{/*			setDateRange({*/}
							{/*				from: range.from || subMonths(new Date(), 1),*/}
							{/*				to: range.to || new Date(),*/}
							{/*			});*/}
							{/*		}}*/}
							{/*	/>*/}
							{/*</div>*/}
						</div>
					</CardContent>
				</Card>

				{reportType === 'tests' && reportData && (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm text-muted-foreground">
										Назначено тестов
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reportData.totalAssigned}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm text-muted-foreground">
										Пройдено тестов
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reportData.totalCompleted}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm text-muted-foreground">
										Процент выполнения
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reportData.completionRate}%
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm text-muted-foreground">
										Средний балл
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reportData.averageScore}
									</div>
								</CardContent>
							</Card>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<BarChart className="h-5 w-5 mr-2" />
										Статистика по подразделениям
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="h-[300px] flex items-center justify-center">
										<div className="text-muted-foreground">
											Здесь будет график статистики по подразделениям
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<PieChart className="h-5 w-5 mr-2" />
										Статистика по тестам
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="h-[300px] flex items-center justify-center">
										<div className="text-muted-foreground">
											Здесь будет график статистики по тестам
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</>
				)}

				{reportType === 'materials' && reportData && (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm text-muted-foreground">
										Всего просмотров
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reportData.totalViews}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm text-muted-foreground">
										Уникальных пользователей
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reportData.uniqueUsers}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm text-muted-foreground">
										Среднее время
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reportData.averageTimeSpent}
									</div>
								</CardContent>
							</Card>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<PieChart className="h-5 w-5 mr-2" />
										Статистика по типам материалов
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="h-[300px] flex items-center justify-center">
										<div className="text-muted-foreground">
											Здесь будет график статистики по типам материалов
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<BarChart className="h-5 w-5 mr-2" />
										Самые популярные материалы
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="h-[300px] flex items-center justify-center">
										<div className="text-muted-foreground">
											Здесь будет график популярных материалов
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</>
				)}

				{reportType === 'adaptation' && reportData && (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm text-muted-foreground">
										В процессе адаптации
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reportData.inProgress}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm text-muted-foreground">
										Завершили адаптацию
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reportData.completed}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm text-muted-foreground">
										Не начали адаптацию
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reportData.notStarted}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm text-muted-foreground">
										Средняя длительность
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{reportData.averageDuration}
									</div>
								</CardContent>
							</Card>
						</div>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<BarChart className="h-5 w-5 mr-2" />
									Статистика адаптации по подразделениям
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="h-[300px] flex items-center justify-center">
									<div className="text-muted-foreground">
										Здесь будет график статистики адаптации по подразделениям
									</div>
								</div>
							</CardContent>
						</Card>
					</>
				)}
			</div>
		</div>
	);
}
