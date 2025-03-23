'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	CircleOff,
	Copy,
	Download,
	Eye,
	Layers2,
	MoreHorizontal,
	NotepadTextDashed,
	Pencil,
	Play,
	Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Survey } from '@/types/entities';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import useApi from '@/hooks/useApi';
import Link from 'next/link';
import { Routes } from '@/const/routes';
import { exportSurveyToCsv } from '@/lib/exportToCsv';

export function SurveysList({ surveys }: { surveys: Survey[] }) {
	const api = useApi();
	const queryClient = useQueryClient();
	const { mutateAsync: deleteSurvey } = useMutation({
		mutationFn: async (surveyID: string) => {
			return api.delete(`/surveys/${surveyID}`);
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление опроса',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['surveys-list'] });
			toast({
				title: 'Опрос успешно удален',
				variant: 'default',
			});
		},
	});

	const { mutateAsync: updateSurvey } = useMutation({
		mutationFn: async (surveyData: any) => {
			return api.put(`/surveys/${surveyData.id}/data`, {
				...surveyData,
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное редактирование опроса',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['surveys-list'] });
			toast({
				title: 'Опрос успешно обновлен',
				variant: 'default',
			});
		},
	});

	const updateSurveyStatus = async (survey: Survey, status: string) => {
		await updateSurvey({ id: survey.id, status });
	};

	const getSurveyBadgeText = (status: string) => {
		if (status === 'ACTIVE') {
			return 'Активный';
		} else if (status === 'COMPLETED') {
			return 'Завершенный';
		}
		return 'Черновик';
	};

	if (!surveys) {
		return null;
	}

	const exportToExcel = (survey: Survey) => {
		if (!survey) {
			toast({
				title: 'Ошибка экспорта',
				description: 'Данные опроса недоступны',
				variant: 'destructive',
			});
			return;
		}

		try {
			exportSurveyToCsv(survey);
			toast({
				title: 'Экспорт выполнен',
				description: 'Результаты опроса успешно экспортированы в CSV',
			});
		} catch (error) {
			console.error('Ошибка при экспорте:', error);
			toast({
				title: 'Ошибка экспорта',
				description: 'Не удалось экспортировать результаты опроса',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="space-y-4">
			{surveys.map((survey) => (
				<div
					key={survey.id}
					className="flex items-center justify-between p-4 border rounded-lg bg-white"
				>
					<div className="flex items-start gap-4">
						<div>
							<div className="flex items-center gap-2">
								<h3 className="font-medium">{survey.title}</h3>
								<Badge
									variant={survey.status === 'ACTIVE' ? 'default' : 'secondary'}
								>
									{getSurveyBadgeText(survey.status)}
								</Badge>
							</div>
							<p className="text-sm text-muted-foreground mt-1">
								Изменен:{' '}
								{survey?.updatedAt
									? format(survey?.updatedAt, 'dd MMMM yyyy', { locale: ru })
									: ''}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<Link href={`${Routes.ADMIN}/surveys/${survey?.id}`}>
									<DropdownMenuItem>
										<Pencil className="h-4 w-4 mr-2" />
										Редактировать
									</DropdownMenuItem>
								</Link>

								<DropdownMenuItem
									onClick={() => {
										navigator.clipboard.writeText(
											`${window?.location?.origin}${Routes.ADMIN}/surveys/${survey?.id}/take`,
										);
									}}
								>
									<Copy className="h-4 w-4 mr-2" /> Копировать ссылку
								</DropdownMenuItem>

								<DropdownMenuItem
									onClick={() => {
										navigator.clipboard.writeText(
											`${window?.location?.origin}${Routes.ADMIN}/results/${survey?.id}`,
										);
									}}
								>
									<Copy className="h-4 w-4 mr-2" /> Поделится результатами
								</DropdownMenuItem>

								<Link href={`${Routes.ADMIN}/surveys/${survey?.id}/copy`}>
									<DropdownMenuItem>
										<Layers2 className="h-4 w-4 mr-2" />
										Копировать опрос
									</DropdownMenuItem>
								</Link>
								{survey?.status === 'DRAFT' && (
									<DropdownMenuItem
										onClick={() => {
											updateSurveyStatus(survey, 'ACTIVE');
										}}
									>
										<Play className="h-4 w-4 mr-2" />
										Активировать
									</DropdownMenuItem>
								)}
								{survey?.status === 'ACTIVE' && (
									<DropdownMenuItem
										onClick={() => {
											updateSurveyStatus(survey, 'COMPLETED');
										}}
									>
										<CircleOff className="h-4 w-4 mr-2" />
										Завершить
									</DropdownMenuItem>
								)}
								{survey?.status !== 'DRAFT' && (
									<DropdownMenuItem
										onClick={() => {
											updateSurveyStatus(survey, 'DRAFT');
										}}
									>
										<NotepadTextDashed className="h-4 w-4 mr-2" /> В черновик
									</DropdownMenuItem>
								)}
								<Link href={`${Routes.ADMIN}/results/${survey?.id}`}>
									<DropdownMenuItem>
										<Eye className="h-4 w-4 mr-2" />
										Посмотреть результаты
									</DropdownMenuItem>
								</Link>
								<DropdownMenuItem onClick={() => exportToExcel(survey)}>
									<Download className="h-4 w-4 mr-2" />
									Выгрузить в Excel
								</DropdownMenuItem>
								<DropdownMenuItem
									className="text-red-600"
									onClick={() => {
										if (survey?.id) {
											deleteSurvey(survey.id);
										}
									}}
								>
									<Trash2 className="h-4 w-4 mr-2" />
									Удалить
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			))}
		</div>
	);
}
