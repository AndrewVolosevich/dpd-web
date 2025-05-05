'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, CheckCircle, Search } from 'lucide-react';
import type { ExtendedAssignment } from '@/types/education';

export default function CompletedTests({
	surveyAssignments,
}: {
	surveyAssignments?: ExtendedAssignment[];
}) {
	const [searchQuery, setSearchQuery] = useState('');
	const completedAssignments = useMemo(() => {
		return (
			surveyAssignments?.filter((assignment) => {
				return assignment?.completedAt && !!assignment?.survey;
			}) || []
		);
	}, [surveyAssignments]);

	// Фильтрация тестов по поисковому запросу
	const filteredAssignments = completedAssignments?.filter(
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

	// Получение цвета бейджа в зависимости от результата
	const getScoreColor = (score: number) => {
		if (score >= 90) return 'bg-green-500';
		if (score >= 75) return 'bg-blue-500';
		if (score >= 60) return 'bg-yellow-500';
		return 'bg-red-500';
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center space-x-2">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Поиск по пройденным тестам..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-8"
					/>
				</div>
			</div>

			{filteredAssignments.length === 0 ? (
				<div className="text-center py-12">
					<CheckCircle className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-4 text-lg font-medium">Нет пройденных тестов</h3>
					<p className="mt-2 text-sm text-muted-foreground">
						Вы еще не прошли ни одного теста
					</p>
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{filteredAssignments.map((assignment) => (
						<Card key={assignment?.survey?.id} className="flex flex-col">
							<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
								<CardTitle className="line-clamp-2">
									{assignment?.survey?.title}
								</CardTitle>
								{assignment?.survey?.testResults?.score && (
									<Badge
										className={`${getScoreColor(assignment?.survey?.testResults?.score)} hover:${getScoreColor(assignment?.survey?.testResults?.score)}`}
									>
										{assignment?.survey?.testResults?.score}%
									</Badge>
								)}
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-sm text-muted-foreground line-clamp-3 mb-4">
									{assignment?.survey?.description || 'Нет описания'}
								</p>
								<div className="flex items-center text-sm mt-4">
									<Check className="h-4 w-4 mr-1 text-green-500" />
									{assignment?.completedAt && (
										<span>Пройден: {formatDate(assignment?.completedAt)}</span>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
