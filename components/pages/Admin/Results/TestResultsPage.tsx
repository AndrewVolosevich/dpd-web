'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Download, XCircle } from 'lucide-react';
import { Loader } from '@/components/common/Loader/Loader';
import { exportSurveyToCsv } from '@/lib/exportToCsv';
import { Button } from '@/components/ui/button';
import useSurvey from '@/lib/api/queries/Education/useSurvey';

const TestResultsPage = ({ id }: { id: string }) => {
	const { data, isLoading } = useSurvey(id);
	if (isLoading) {
		return (
			<div className={'min-h-screen w-full flex items-center justify-center'}>
				<Loader />
			</div>
		);
	}

	if (!data) {
		return (
			<div className="text-center py-8 container">
				<p className="text-muted-foreground">
					Не удалось загрузить результаты теста.
				</p>
			</div>
		);
	}

	const handleExportToCsv = () => {
		try {
			exportSurveyToCsv(data);
		} catch (error) {
			console.error('Ошибка экспорта в CSV:', error);
		}
	};

	const { title, status, questions, responses, _count } = data;

	return (
		<div className="py-6 space-y-6 container mx-auto">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">{title} - Результаты теста</h1>
				<Button variant={'outline'} onClick={handleExportToCsv}>
					<Download className="mr-2 w-5 h-5" />
					Экспорт в Excel
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Общая информация</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex justify-between items-center">
						<p className="text-sm text-muted-foreground">Статус теста</p>
						<Badge variant="outline">
							{status === 'ACTIVE' ? 'Активный' : 'Завершен'}
						</Badge>
					</div>
					<div className="flex justify-between items-center">
						<p className="text-sm text-muted-foreground">Респондентов</p>
						<p>{_count?.responses ?? responses?.length}</p>
					</div>
				</CardContent>
			</Card>

			{responses?.map((response) => (
				<Card key={response.id}>
					<CardHeader>
						<CardTitle>
							{data?.type === 'ANONYMOUS'
								? 'Аноним'
								: `Респондент: ${response.user?.name} ${response.user?.surname} `}
							<span
								className={
									response?.testResults?.passed
										? 'text-green-500'
										: 'text-red-500'
								}
							>
								{response?.testResults?.passed ? 'Пройдено' : 'Не пройдено'}
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex justify-between">
							<p>
								<b>Дата прохождения:</b>{' '}
								{new Date(response.createdAt).toLocaleDateString()}
							</p>
							<p>
								<b>Результат:</b> {response?.testResults?.score}% (
								{response?.testResults?.correctAnswers} из{' '}
								{response?.testResults?.totalQuestions})
							</p>
						</div>

						<div className="space-y-4">
							<h3 className="text-lg font-medium">Детали ответов</h3>
							{questions.map((question) => {
								const answer = response.answers.find(
									(a) => a.questionId === question.id,
								);
								const isCorrect = checkAnswerCorrectness(question, answer);

								return (
									<div key={question.id} className="border rounded-md p-4">
										<div className="flex justify-between items-center">
											<h4>{question.text}</h4>
											{isCorrect !== null && (
												<div>
													{isCorrect ? (
														<CheckCircle2 className="text-green-500 w-5 h-5" />
													) : (
														<XCircle className="text-red-500 w-5 h-5" />
													)}
												</div>
											)}
										</div>
										<div className="text-sm text-muted-foreground mt-2">
											{renderAnswerDetails(question, answer)}
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

function checkAnswerCorrectness(question: any, answer: any) {
	if (!question || !answer || !question.options) return null;

	switch (question.type) {
		case 'SINGLE_CHOICE':
			return question.options.some(
				(option: any) => option.value === answer.value && option.correct,
			);
		case 'MULTIPLE_CHOICE': {
			const correctOptions = question.options
				.filter((option: any) => option.correct)
				.map((option: any) => option.value);
			const selectedValues = Array.isArray(answer.value)
				? answer.value
				: [answer.value];
			return (
				correctOptions.every((value: string) =>
					selectedValues.includes(value),
				) &&
				selectedValues.every((value: string) => correctOptions.includes(value))
			);
		}
		default:
			return null;
	}
}

function renderAnswerDetails(question: any, answer: any) {
	if (!answer) {
		return <p className="text-muted-foreground">Ответ отсутствует</p>;
	}

	switch (question.type) {
		case 'OPEN_TEXT':
			return (
				<div>
					<p>
						<b>Ответ:</b> {answer.value}
					</p>
					{answer.comment && (
						<p className="text-gray-500">
							<b>Комментарий:</b> {answer.comment}
						</p>
					)}
				</div>
			);
		case 'SINGLE_CHOICE':
			return (
				<div>
					<p>
						<b>Выбранный ответ:</b> {answer.value}
					</p>
					{question.options.some((o: any) => o.correct) && (
						<p className="text-green-600">
							<b>Правильный ответ:</b>{' '}
							{question.options.find((o: any) => o.correct)?.value}
						</p>
					)}
				</div>
			);
		case 'MULTIPLE_CHOICE':
			return (
				<div>
					<p>
						<b>Выбранные ответы:</b>{' '}
						{Array.isArray(answer.value)
							? answer.value.join(', ')
							: answer.value}
					</p>
					{question.options.some((o: any) => o.correct) && (
						<p className="text-green-600">
							<b>Правильные ответы:</b>{' '}
							{question.options
								.filter((o: any) => o.correct)
								.map((o: any) => o.value)
								.join(', ')}
						</p>
					)}
				</div>
			);
		default:
			return <p>{JSON.stringify(answer.value)}</p>;
	}
}

export default TestResultsPage;
