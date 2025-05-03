'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/global/AuthProvider';

interface UserTestResultsProps {
	surveyId: string;
	userId?: string;
}

export default function UserTestResults({
	surveyId,
	userId,
}: UserTestResultsProps) {
	const router = useRouter();
	const api = useApi();
	const { user } = useAuth();
	// Fetch test results for specific user
	const { data, isLoading } = useQuery({
		queryKey: ['user-test-results', surveyId, userId],
		queryFn: async () => {
			const resp = await api.get(
				`/surveys/${surveyId}/user-results/${userId || user?.id}`,
			);
			return resp?.data;
		},
	});

	if (isLoading) {
		return (
			<div className="text-center py-8 container">Загрузка результатов...</div>
		);
	}

	if (!data) {
		return (
			<Alert variant="destructive">
				<AlertTitle>Ошибка</AlertTitle>
				<AlertDescription>
					Не удалось загрузить результаты теста
				</AlertDescription>
			</Alert>
		);
	}

	const { survey, response, testResults } = data;
	const { correctAnswers, totalQuestions, score, passed } = testResults || {};

	return (
		<div className="py-6 space-y-6 container m-auto">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">{survey.title} - Результаты</h1>
				<Button variant="outline" onClick={() => router.back()}>
					Назад
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Результаты пользователя</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<h3 className="text-sm font-medium text-muted-foreground">
								Тест
							</h3>
							<p className="text-lg">{survey.title}</p>
						</div>
						<div>
							<h3 className="text-sm font-medium text-muted-foreground">
								Дата прохождения
							</h3>
							<p className="text-lg">
								{new Date(response.createdAt).toLocaleDateString()}
							</p>
						</div>
					</div>

					<Alert variant={passed ? 'default' : 'destructive'}>
						<div className="flex items-center">
							{passed ? (
								<CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
							) : (
								<XCircle className="h-5 w-5 mr-2 text-red-500" />
							)}
							<AlertTitle>
								{passed ? 'Тест пройден!' : 'Тест не пройден'}
							</AlertTitle>
						</div>
						<AlertDescription>
							Правильных ответов: {correctAnswers} из {totalQuestions} (
							{Math.round(score)}%)
						</AlertDescription>
					</Alert>

					<div className="space-y-2">
						<div className="flex justify-between">
							<span className="text-sm font-medium">Результат</span>
							<span className="text-sm font-medium">{Math.round(score)}%</span>
						</div>
						<Progress value={score} className="h-2" />
					</div>

					<div className="space-y-4">
						<h3 className="text-lg font-medium">Детали ответов</h3>
						{survey.questions.map((question: any, index: any) => {
							const answer = response.answers.find(
								(a: any) => a.questionId === question.id,
							);
							const isCorrect = checkAnswerCorrectness(question, answer);

							return (
								<div key={question.id} className="border rounded-md p-4">
									<div className="flex justify-between items-start">
										<div className="space-y-1">
											<h4 className="font-medium">
												Вопрос {index + 1}: {question.text}
											</h4>
											<div className="text-sm">
												{renderAnswerDetails(question, answer)}
											</div>
										</div>
										{question.options &&
											question.options.some((o: any) => o.correct) && (
												<div
													className={`flex items-center ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
												>
													{isCorrect ? (
														<CheckCircle2 className="h-5 w-5" />
													) : (
														<XCircle className="h-5 w-5" />
													)}
												</div>
											)}
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

// Helper function to check if an answer is correct
function checkAnswerCorrectness(question: any, answer: any) {
	if (
		!question.options ||
		!question.options.some((o: any) => o.correct) ||
		!answer
	) {
		return null; // Not applicable for questions without correct answers
	}

	if (question.type === 'SINGLE_CHOICE') {
		const selectedOption = question.options.find(
			(o: any) => o.value === answer.value,
		);
		return selectedOption && selectedOption.correct;
	}

	if (question.type === 'MULTIPLE_CHOICE') {
		const selectedValues = Array.isArray(answer.value)
			? answer.value
			: [answer.value];
		const correctOptions = question.options
			.filter((o: any) => o.correct)
			.map((o: any) => o.value);
		const incorrectOptions = question.options
			.filter((o: any) => !o.correct)
			.map((o: any) => o.value);

		// All correct options must be selected and no incorrect ones
		const allCorrectSelected = correctOptions.every((o: any) =>
			selectedValues.includes(o),
		);
		const noIncorrectSelected = !selectedValues.some((v: any) =>
			incorrectOptions.includes(v),
		);

		return allCorrectSelected && noIncorrectSelected;
	}

	return null;
}

// Helper function to render answer details
function renderAnswerDetails(question: any, answer: any) {
	if (!answer) {
		return <p className="text-muted-foreground">Нет ответа</p>;
	}
	const selectedValues = Array.isArray(answer.value)
		? answer.value
		: [answer.value];

	switch (question.type) {
		case 'SINGLE_CHOICE':
			return (
				<div>
					<p>Ответ: {answer.value}</p>
					{question.options && question.options.some((o: any) => o.correct) && (
						<p className="text-green-600">
							Правильный ответ:{' '}
							{question.options.find((o: any) => o.correct)?.value}
						</p>
					)}
				</div>
			);

		case 'MULTIPLE_CHOICE':
			return (
				<div>
					<p>Выбрано: {selectedValues.join(', ')}</p>
					{question.options && question.options.some((o: any) => o.correct) && (
						<p className="text-green-600">
							Правильные ответы:{' '}
							{question.options
								.filter((o: any) => o.correct)
								.map((o: any) => o.value)
								.join(', ')}
						</p>
					)}
				</div>
			);

		case 'OPEN_TEXT':
			return <p>{answer.value}</p>;

		default:
			return <p>{JSON.stringify(answer.value)}</p>;
	}
}
