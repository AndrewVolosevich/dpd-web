'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Clock, FileCheck, Search } from 'lucide-react';
import { Survey } from '@/types/entities';

// Будет заменено на реальные данные из API
const MOCK_ASSIGNED_SURVEYS: Survey[] = [
	{
		id: '1',
		title: 'Оценка знаний по пожарной безопасности',
		type: 'PERSONALIZED',
		status: 'ACTIVE',
		questions: [],
		description:
			'Обязательный ежегодный тест по знанию правил пожарной безопасности',
		createdAt: '2023-05-10T10:00:00Z',
		endDate: '2023-06-10T23:59:59Z',
	},
	{
		id: '2',
		title: 'Тест на знание корпоративной культуры',
		type: 'PERSONALIZED',
		status: 'ACTIVE',
		questions: [],
		description: 'Проверка знаний основных ценностей и принципов компании',
		createdAt: '2023-05-15T10:00:00Z',
		endDate: '2023-06-15T23:59:59Z',
	},
	{
		id: '3',
		title: 'Оценка компетенций сотрудника',
		type: 'PERSONALIZED',
		status: 'ACTIVE',
		questions: [],
		description: 'Ежеквартальная оценка профессиональных навыков',
		createdAt: '2023-05-20T10:00:00Z',
		endDate: '2023-06-20T23:59:59Z',
	},
];

export default function AssignedTests() {
	const [searchQuery, setSearchQuery] = useState('');
	// eslint-disable-next-line
	const [assignedSurveys, setAssignedSurveys] = useState<Survey[]>(
		MOCK_ASSIGNED_SURVEYS,
	);

	// Фильтрация тестов по поисковому запросу
	const filteredSurveys = assignedSurveys.filter(
		(survey) =>
			survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(survey.description &&
				survey.description.toLowerCase().includes(searchQuery.toLowerCase())),
	);

	// Форматирование даты в удобный вид
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	// Рассчет оставшихся дней
	const getDaysLeft = (endDateString: string | undefined) => {
		if (!endDateString) return 'Нет срока';

		const endDate = new Date(endDateString);
		const today = new Date();

		const diffTime = endDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays < 0) return 'Просрочено';
		if (diffDays === 0) return 'Последний день';

		return `${diffDays} ${getDayWord(diffDays)}`;
	};

	// Склонение слова "день"
	const getDayWord = (days: number) => {
		if (days % 10 === 1 && days % 100 !== 11) {
			return 'день';
		} else if (
			[2, 3, 4].includes(days % 10) &&
			![12, 13, 14].includes(days % 100)
		) {
			return 'дня';
		} else {
			return 'дней';
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center space-x-2">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Поиск по назначенным тестам..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-8"
					/>
				</div>
			</div>

			{filteredSurveys.length === 0 ? (
				<div className="text-center py-12">
					<FileCheck className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-4 text-lg font-medium">Нет назначенных тестов</h3>
					<p className="mt-2 text-sm text-muted-foreground">
						На данный момент вам не назначено ни одного теста
					</p>
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{filteredSurveys.map((survey) => (
						<Card key={survey.id} className="flex flex-col">
							<CardHeader>
								<CardTitle className="line-clamp-2">{survey.title}</CardTitle>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-sm text-muted-foreground line-clamp-3 mb-4">
									{survey.description || 'Нет описания'}
								</p>
								<div className="flex items-center text-sm mt-2">
									<Clock className="h-4 w-4 mr-1 text-muted-foreground" />
									<span>
										До:{' '}
										{survey.endDate ? formatDate(survey.endDate) : 'Нет срока'}
									</span>
								</div>
								<div className="mt-1 text-sm">
									<span
										className={`font-medium ${getDaysLeft(survey.endDate).includes('Просрочено') ? 'text-red-500' : ''}`}
									>
										{getDaysLeft(survey.endDate)}
									</span>
								</div>
							</CardContent>
							<CardFooter>
								<Button className="w-full">Начать тест</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
