'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Clock, FileCheck } from 'lucide-react';
import useUserAssignments from '@/lib/api/queries/Education/useUserAssignments';
import { useAuth } from '@/components/providers/global/AuthProvider';

export default function UserAdaptationPlan() {
	const { user } = useAuth();
	const { data: assignments } = useUserAssignments(user?.userPanelId);
	// Фильтрация тестов по поисковому запросу
	const filteredAssignments = assignments?.filter((assignment) => {
		return !!assignment?.adaptationPlan?.id;
	});

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
			{filteredAssignments?.length === 0 ? (
				<div className="text-center py-12">
					<FileCheck className="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 className="mt-4 text-lg font-medium">
						Нет назначенных адаптационных планов
					</h3>
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{filteredAssignments?.map((assignment) => (
						<Card key={assignment?.id} className="flex flex-col">
							<CardHeader>
								<CardTitle className="line-clamp-2">План адаптации</CardTitle>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="text-sm text-muted-foreground line-clamp-3 mb-4">
									{assignment?.adaptationPlan?.supervisorComment ||
										'Нет описания'}
								</p>
								<div className="flex items-center text-sm mt-2">
									<Clock className="h-4 w-4 mr-1 text-muted-foreground" />
									<span>
										До:{' '}
										{assignment?.dueDate
											? formatDate(assignment?.dueDate)
											: 'Нет срока'}
									</span>
								</div>
								<div className="mt-1 text-sm">
									<span
										className={`font-medium ${getDaysLeft(assignment?.dueDate).includes('Просрочено') ? 'text-red-500' : ''}`}
									>
										{getDaysLeft(assignment?.dueDate)}
									</span>
								</div>
							</CardContent>
							<CardFooter className="flex justify-end">
								<Button
									variant="default"
									size="sm"
									onClick={(e) => {
										e.stopPropagation();
										const fileUrl = assignment?.adaptationPlan?.fileUrl || '';
										const anchor = document.createElement('a');
										anchor.href = fileUrl;
										anchor.download = `план_адаптации_${user?.name}_${user?.surname}`;
										anchor.click();
									}}
									title="Скачать файл"
								>
									Скачать план
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
