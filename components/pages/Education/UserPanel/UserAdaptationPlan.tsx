'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Clock, Download, FileCheck, Loader2 } from 'lucide-react';
import useUserAssignments from '@/lib/api/queries/Education/useUserAssignments';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { AdaptationStatus } from '@/types/education';
import { useUpdateAdaptationStatus } from '@/lib/api/queries/Education/mutations/assign/useUpdateAdaptationStatus';

export default function UserAdaptationPlan() {
	const { user } = useAuth();
	const { data: assignments } = useUserAssignments(user?.userPanelId);
	const { mutate: updatePlanStatus, isPending } = useUpdateAdaptationStatus();
	// Фильтрация тестов по поисковому запросу
	const filteredAssignments = assignments?.filter((assignment) => {
		return !!assignment?.adaptationPlan?.id;
	});

	const handleUpdateStatus = (id?: string) => {
		if (!id) return;
		updatePlanStatus({ planId: id, status: AdaptationStatus.ACKNOWLEDGED });
	};

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
					{filteredAssignments?.map((assignment) => {
						const getMemo: () => string = () => {
							if (
								assignment?.adaptationPlan?.status === AdaptationStatus.ASSIGNED
							) {
								return 'Вам назначена программа адаптации. Откройте файл «План адаптации» и ознакомьтесь с планом мероприятий на период испытательного срока/обучения. После ознакомления с планом нажмите кнопку «Ознакомлен». При возникновении вопросов обращайтесь к вашему непосредственному руководителю. Желаем вам успехов и легкого вхождения в должность!';
							}
							if (
								assignment?.adaptationPlan?.status ===
								AdaptationStatus.ASSESSMENT
							) {
								return (
									'Обратите внимание - ваш адаптационный период подходит к завершению. В ближайшие несколько дней состоится беседа с вашим непосредственным руководителем для подведения итогов испытательного срока/обучения.' +
									'До встречи с руководителем: \n' +
									'- пройдите опрос «Анкета обратной связи», который проводится с целью оценки уровня удовлетворенности условиями работы и отношениями в коллективе; \n' +
									'- подготовьтесь к оценке необходимых знаний и навыков для самостоятельной работы в компании. '
								);
							}
							if (
								assignment?.adaptationPlan?.status ===
								AdaptationStatus.COMPLETED
							) {
								return 'Ознакомиться с результатами испытательного срока/адаптации вы можете, открыв файл «План адаптации». ';
							}
							return '';
						};
						return (
							<Card key={assignment?.id} className="flex flex-col">
								<CardHeader>
									<CardTitle className="line-clamp-2">План адаптации</CardTitle>
								</CardHeader>
								<CardContent className="flex-1">
									<p className="text-sm text-muted-foreground mb-4">
										{getMemo()}
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
										variant="outline"
										size="sm"
										className={'mr-2'}
										onClick={(e) => {
											e.stopPropagation();
											const fileUrl = assignment?.adaptationPlan?.fileUrl || '';
											const anchor = document.createElement('a');
											anchor.href = fileUrl;
											anchor.download = `план_адаптации_${user?.name}_${user?.surname}`;
											anchor.click();
										}}
									>
										<Download className="h-4 w-4 mr-2" />
										Скачать план
									</Button>
									{assignment?.adaptationPlan?.status ===
										AdaptationStatus.ASSIGNED && (
										<Button
											variant="default"
											size="sm"
											onClick={() =>
												handleUpdateStatus(assignment?.adaptationPlan?.id)
											}
											disabled={isPending}
										>
											{isPending && (
												<Loader2 className="animate-spin h-4 w-4 mr-2" />
											)}
											Ознакомлен
										</Button>
									)}
								</CardFooter>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}
