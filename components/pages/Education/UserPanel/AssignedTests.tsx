'use client';

import { useMemo, useState } from 'react';
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
import type { Assignment } from '@/types/education';
import Link from 'next/link';

export default function AssignedTests({
	surveyAssignments,
}: {
	surveyAssignments?: Assignment[];
}) {
	const [searchQuery, setSearchQuery] = useState('');
	const assignedSurveys = useMemo(() => {
		return (
			surveyAssignments?.filter((assignment) => {
				return !assignment?.completedAt && !!assignment?.survey;
			}) || []
		);
	}, [surveyAssignments]);

	// Фильтрация тестов по поисковому запросу
	const filteredSurveys = assignedSurveys?.filter(
		(assignment) =>
			assignment?.survey?.title
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			(assignment?.survey?.description &&
				assignment?.survey?.description
					.toLowerCase()
					.includes(searchQuery.toLowerCase())),
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
						<Card key={survey?.survey?.id} className="flex flex-col">
							<CardHeader>
								<CardTitle className="line-clamp-2">
									{survey?.survey?.title}
								</CardTitle>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-sm text-muted-foreground line-clamp-3 mb-4">
									{survey?.survey?.description || 'Нет описания'}
								</p>
								<div className="flex items-center text-sm mt-2">
									<Clock className="h-4 w-4 mr-1 text-muted-foreground" />
									<span>
										До:{' '}
										{survey?.survey?.endDate
											? formatDate(survey?.survey?.endDate)
											: 'Нет срока'}
									</span>
								</div>
								<div className="mt-1 text-sm">
									<span
										className={`font-medium ${getDaysLeft(survey?.survey?.endDate).includes('Просрочено') ? 'text-red-500' : ''}`}
									>
										{getDaysLeft(survey?.survey?.endDate)}
									</span>
								</div>
							</CardContent>
							<CardFooter>
								<Link href={`/admin/surveys/${survey?.survey?.id}/take`}>
									<Button className="w-full">Начать тест</Button>
								</Link>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
