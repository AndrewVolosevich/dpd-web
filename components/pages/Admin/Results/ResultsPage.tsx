'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Users } from 'lucide-react';
import { OpenTextResults } from '@/components/pages/Admin/Results/OpenTextResults';
import { ChoiceResults } from '@/components/pages/Admin/Results/ChoiseResults';
import { RatingResults } from '@/components/pages/Admin/Results/RatingResults';
import { MatrixResults } from '@/components/pages/Admin/Results/MatrixResults';
import useSurvey from '@/lib/api/queries/Education/useSurvey';
import { SurveyStatus } from '@/types/entities';
import { PhotoResults } from '@/components/pages/Admin/Results/PhotoResults';
import { exportSurveyToCsv } from '@/lib/exportToCsv';

export default function ResultsPage({ id }: { id: string }) {
	const [activeTab, setActiveTab] = useState('overview');
	const { data, isLoading } = useSurvey(id);

	const survey = useMemo(() => (data ? data : null), [data]);

	const getStatusBadge = (status: SurveyStatus) => {
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

	const exportToExcel = () => {
		if (survey) {
			exportSurveyToCsv(survey);
		}
	};

	if (isLoading) {
		return (
			<div className="container py-6 space-y-6">
				<Skeleton className="h-12 w-3/4" />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	if (!survey) {
		return (
			<div className="container py-6">
				<Card>
					<CardContent className="pt-6">
						<p className="text-center text-muted-foreground">
							Опрос не найден или у вас нет доступа к результатам
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container py-6 space-y-6 m-auto">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">{survey.title}</h1>
					<p className="text-muted-foreground">{survey.description}</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" onClick={exportToExcel}>
						<Download className="h-4 w-4 mr-2" />
						Экспорт в Excel
					</Button>
				</div>
			</div>

			<Card>
				<CardContent className="pt-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground">Статус</p>
							<div>{getStatusBadge(survey.status)}</div>
						</div>
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground">
								Количество респондентов
							</p>
							<div className="flex items-center">
								<Users className="h-5 w-5 mr-2 text-muted-foreground" />
								{survey?.responses?.length && (
									<span className="text-xl font-medium">
										{survey?.responses?.length}
									</span>
								)}
							</div>
						</div>
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground">
								Последнее обновление
							</p>
							{survey?.updatedAt && (
								<div>{new Date(survey?.updatedAt).toLocaleDateString()}</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="mb-4">
					<TabsTrigger value="overview">Обзор</TabsTrigger>
					<TabsTrigger value="questions">По вопросам</TabsTrigger>
					<TabsTrigger value="respondents">Респонденты</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Общая статистика</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								{survey.questions.map((question) => (
									<div key={question.id} className="border-t pt-4">
										<h3 className="text-lg font-medium mb-2">
											{question.text}
										</h3>
										{question.type === 'OPEN_TEXT' && (
											<OpenTextResults question={question as any} />
										)}
										{(question.type === 'SINGLE_CHOICE' ||
											question.type === 'MULTIPLE_CHOICE') && (
											<ChoiceResults question={question as any} />
										)}
										{question.type === 'RATING' && (
											<RatingResults question={question as any} />
										)}
										{question.type === 'MATRIX' && (
											<MatrixResults question={question as any} />
										)}
										{question.type === 'PHOTO' && (
											<PhotoResults question={question as any} />
										)}
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="questions" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Результаты по вопросам</CardTitle>
						</CardHeader>
						<CardContent>
							<Tabs defaultValue={survey.questions[0]?.id} className="w-full">
								<TabsList className="mb-4 flex flex-wrap">
									{survey.questions.map((question, index) => (
										<TabsTrigger
											key={question.id}
											value={question.id as string}
										>
											Вопрос {index + 1}
										</TabsTrigger>
									))}
								</TabsList>

								{survey.questions.map((question) => (
									<TabsContent
										key={question.id}
										value={question.id as string}
										className="space-y-4"
									>
										<div>
											<h3 className="text-lg font-medium mb-2">
												{question.text}
											</h3>
											{question.type === 'OPEN_TEXT' && (
												<OpenTextResults question={question as any} />
											)}
											{(question.type === 'SINGLE_CHOICE' ||
												question.type === 'MULTIPLE_CHOICE') && (
												<ChoiceResults question={question as any} />
											)}
											{question.type === 'RATING' && (
												<RatingResults question={question as any} />
											)}
											{question.type === 'MATRIX' && (
												<MatrixResults question={question as any} />
											)}
											{question.type === 'PHOTO' && (
												<PhotoResults question={question as any} />
											)}
										</div>
									</TabsContent>
								))}
							</Tabs>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="respondents" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Список респондентов</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{survey?.responses?.map((response) => (
									<div key={response.id} className="p-2 border rounded-md">
										<div className="flex justify-between">
											<span>ID: {response.userId}</span>
											<span className="text-sm text-muted-foreground">
												{new Date(response.createdAt).toLocaleDateString()}
											</span>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
