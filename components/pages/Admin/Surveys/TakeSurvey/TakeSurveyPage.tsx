'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	ArrowLeft,
	ArrowRight,
	PlayCircle,
	PlusCircle,
	Send,
} from 'lucide-react';
import { OpenQuestion } from '@/components/pages/Admin/Surveys/TakeSurvey/Questions/OpenQuestion';
import { ChoiceQuestion } from './Questions/ChoiceQuestion';
import { RatingQuestion } from '@/components/pages/Admin/Surveys/TakeSurvey/Questions/RatingQuestion';
import { Progress } from '@/components/ui/progress';
import useSurvey from '@/lib/api/queries/Education/useSurvey';
import {
	Answer,
	Question,
	TestResults,
	UserResponseForSurvey,
} from '@/types/entities';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { Routes } from '@/const/routes';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MatrixQuestion } from '@/components/pages/Admin/Surveys/TakeSurvey/Questions/MatrixQuestion';
import { PhotoQuestion } from '@/components/pages/Admin/Surveys/TakeSurvey/Questions/PhotoQuestion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useCreateResponseForSurvey } from '@/lib/api/queries/Education/mutations/survey/useCreateResponseForSurvey';
import { useGetTestResults } from '@/lib/api/queries/Education/useGetTestResults';
import { OrderingQuestion } from '@/components/pages/Admin/Surveys/TakeSurvey/Questions/OrderingQuestion';
import { useIncreaseSurveyAttempts } from '@/lib/api/queries/Education/mutations/survey/useIncreaseSurveyAttempts';
import CustomTimer from '@/components/common/CustomTimer';

const TakeSurveyPage = ({ surveyId }: { surveyId: string }) => {
	const { data } = useSurvey(surveyId);
	const { user } = useAuth();
	const router = useRouter();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<Answer[]>([]);
	const [started, setStarted] = useState(false);
	const [showComment, setShowComment] = useState<boolean>(false);
	const [testResults, setTestResults] = useState<any>(null);
	const [questions, setQuestions] = useState<Question[]>([]); // Добавляем состояние для вопросов
	const [timeExceedResponse, setTimeExceedResponse] =
		useState<UserResponseForSurvey | null>(null);

	useEffect(() => {
		if (data?.questions) {
			const mixedQuestions = data?.isMixed
				? [...data.questions].sort(() => Math.random() - 0.5) // Перемешиваем вопросы
				: data.questions;
			setQuestions(mixedQuestions); // Устанавливаем перемешанные или упорядоченные вопросы
		}
	}, [data]);

	const { mutateAsync: createResponse, isPending } =
		useCreateResponseForSurvey();

	const { mutateAsync: getResults, isPending: loadingResults } =
		useGetTestResults();

	const { mutateAsync: increaseAttempts } = useIncreaseSurveyAttempts();

	if (!surveyId || !data || !questions?.length || !user?.id) {
		return null;
	}
	const currentQuestion = questions[currentQuestionIndex] as Question & {
		id: string;
	};
	const progress = started
		? ((currentQuestionIndex + 1) / questions?.length) * 100
		: 0;

	const handleAnswer = (value: any) => {
		setAnswers((prevAnswers) => {
			const existingAnswerIndex = prevAnswers.findIndex(
				(a) => a.questionId === currentQuestion.id,
			);

			if (existingAnswerIndex !== -1) {
				const updatedAnswers = [...prevAnswers];
				updatedAnswers[existingAnswerIndex] = {
					...updatedAnswers[existingAnswerIndex],
					value,
				};
				return updatedAnswers;
			} else {
				return [
					...prevAnswers,
					{ questionId: currentQuestion.id, value } as Answer,
				];
			}
		});
	};

	const handleTimeExceed = async () => {
		const resp = await increaseAttempts({
			surveyId,
			userId: user.id,
		});
		setTimeExceedResponse(resp?.data);
	};

	const addComment = (comment: string) => {
		setAnswers((prevAnswers) => {
			const existingAnswerIndex = prevAnswers.findIndex(
				(a) => a.questionId === currentQuestion.id,
			);

			if (existingAnswerIndex !== -1) {
				const updatedAnswers = [...prevAnswers];
				updatedAnswers[existingAnswerIndex] = {
					...updatedAnswers[existingAnswerIndex],
					comment,
				};
				return updatedAnswers;
			}
			return prevAnswers;
		});
	};

	const handleNext = () => {
		if (currentQuestionIndex < (questions?.length || 1) - 1) {
			setShowComment(false);
			setCurrentQuestionIndex((prev) => prev + 1);
		}
	};

	const handlePrevious = () => {
		if (currentQuestionIndex > 0) {
			setShowComment(false);
			setCurrentQuestionIndex((prev) => prev - 1);
		}
	};

	const handleSubmit = async () => {
		const sortedAnswers = answers.sort((a, b) => {
			const originalOrder = data.questions.map((q) => q.id); // Получаем порядок вопросов из изначального массива
			return (
				originalOrder.indexOf(a.questionId) -
				originalOrder.indexOf(b.questionId)
			);
		});

		const respData = {
			surveyId,
			userId: user.id,
			answers: sortedAnswers,
		};
		await createResponse(respData);
		// If this is a test, get the results
		if (data.surveyVariant === 'TEST') {
			await getResults(
				{ surveyId, userId: user.id },
				{
					onSuccess: (response: any) => {
						setTestResults(response?.data);
					},
				},
			);
		} else {
			router.push(`${Routes.HOME}`);
		}
	};

	const getAnswerById = (id: string) => {
		return answers.find((answer) => answer.questionId === id);
	};

	const canProceed =
		!currentQuestion.isRequired ||
		getAnswerById(currentQuestion.id) !== undefined;

	const renderQuestion = () => {
		switch (currentQuestion.type) {
			case 'OPEN_TEXT':
				return (
					<OpenQuestion
						value={getAnswerById(currentQuestion.id)?.value || ''}
						onChange={handleAnswer}
					/>
				);
			case 'SINGLE_CHOICE':
			case 'MULTIPLE_CHOICE':
				return (
					<ChoiceQuestion
						question={currentQuestion as any}
						value={
							getAnswerById(currentQuestion.id)?.value ||
							(currentQuestion.type === 'MULTIPLE_CHOICE' ? [] : '')
						}
						onChange={handleAnswer}
					/>
				);
			case 'RATING':
				return (
					<RatingQuestion
						question={currentQuestion as any}
						value={getAnswerById(currentQuestion.id)?.value}
						onChange={handleAnswer}
					/>
				);
			case 'MATRIX':
				return (
					<MatrixQuestion
						question={currentQuestion as any}
						value={
							(getAnswerById(currentQuestion.id)?.value as Record<
								string,
								string
							>) || {}
						}
						onChange={handleAnswer}
					/>
				);
			case 'PHOTO':
				return (
					<PhotoQuestion
						question={currentQuestion as any}
						value={
							getAnswerById(currentQuestion.id)?.value ||
							(currentQuestion.allowMultipleSelection ? [] : '')
						}
						onChange={handleAnswer}
					/>
				);
			case 'ORDERING':
				return (
					<OrderingQuestion
						question={currentQuestion as any}
						value={
							getAnswerById(currentQuestion.id)?.value ||
							currentQuestion.options.map((o) => o.value)
						}
						onChange={(newOrder) => {
							handleAnswer(newOrder);
						}}
					/>
				);

			default:
				return null;
		}
	};

	const renderComment = () => {
		if (currentQuestion?.allowComment && answers[currentQuestionIndex]?.value) {
			return (
				<>
					{!showComment ? (
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setShowComment(true);
							}}
						>
							<PlusCircle className="h-4 w-4 mr-2" />
							Оставить комментарий
						</Button>
					) : (
						<Textarea
							placeholder="Введите ваш комментарий к вопросу..."
							value={answers[currentQuestionIndex]?.comment || ''}
							onChange={(e) => addComment(e.target.value)}
						/>
					)}
				</>
			);
		}
		return null;
	};

	const renderTestResults = () => {
		if (!testResults || !testResults?.testResults) return null;

		const { correctAnswers, totalQuestions, score, passed } =
			testResults?.testResults as TestResults;
		const hasAttempts =
			testResults?.survey?.attemptsLimit > testResults?.response?.attempts &&
			!passed;

		return (
			<div className="space-y-4">
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
						Вы ответили правильно на {correctAnswers} из {totalQuestions}{' '}
						вопросов ({Math.round(score)}%)
					</AlertDescription>
				</Alert>

				<div className="flex justify-center">
					{hasAttempts && (
						<Button
							variant={'outline'}
							className={'mr-2'}
							onClick={() => {
								window?.location?.reload();
							}}
						>
							Пройти еще раз
						</Button>
					)}
					<Button onClick={() => router.push(Routes.HOME)}>
						Вернуться на главную
					</Button>
				</div>
			</div>
		);
	};

	const renderTimeExceed = () => {
		if (!timeExceedResponse) return null;
		const hasAttempts =
			(data?.attemptsLimit ?? 0) > timeExceedResponse?.attempts;

		return (
			<div className="space-y-4">
				<div>
					К сожалению, вы не закончили тест вовремя. Попробуйте ещё раз, если
					попытки ещё доступны.
				</div>

				<div className="flex justify-center">
					{hasAttempts && (
						<Button
							variant={'outline'}
							className={'mr-2'}
							onClick={() => {
								window?.location?.reload();
							}}
						>
							Пройти еще раз
						</Button>
					)}
					<Button onClick={() => router.push(Routes.HOME)}>
						Вернуться на главную
					</Button>
				</div>
			</div>
		);
	};

	if (testResults) {
		return (
			<div className="container py-6 space-y-6 m-auto">
				<h2 className="text-2xl font-bold mb-4">{data.title} - Результаты</h2>
				{renderTestResults()}
			</div>
		);
	}

	if (timeExceedResponse) {
		return (
			<div className="container py-6 space-y-6 m-auto">
				<h2 className="text-2xl font-bold mb-4">Время истекло</h2>
				{renderTimeExceed()}
			</div>
		);
	}

	return (
		<div className="container py-6 space-y-6 m-auto">
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold mb-2">{data.title}</h1>
					<p className="text-muted-foreground">{data.description}</p>
					{data.surveyVariant === 'TEST' && (
						<div className="mt-2 p-2 bg-muted rounded-md">
							<p className="text-sm font-medium">
								Это тест с проверкой знаний. Ваши ответы будут оценены.
							</p>
						</div>
					)}
				</div>

				<div className="space-y-2">
					<div className="flex justify-between text-sm text-muted-foreground">
						{started && (
							<>
								<span>
									Вопрос {currentQuestionIndex + 1} из {data.questions.length}
								</span>
								<span>{Math.round(progress)}%</span>
							</>
						)}
					</div>
					<Progress value={progress} className="h-2" />
				</div>

				<div className="space-y-2">
					{data?.timeLimit && !started && (
						<span>Это тест на время, у вас будет {data?.timeLimit} мин.</span>
					)}
					{data?.timeLimit && started && (
						<CustomTimer
							timeLimit={data?.timeLimit}
							onTimeout={handleTimeExceed}
						/>
					)}
				</div>

				<Card className="p-6">
					{!started ? (
						<div className="space-y-6">
							<div className="space-y-2">
								<h2 className="text-lg font-medium">Добро пожаловать!</h2>
								<div className="text-muted-foreground whitespace-pre-line">
									{data?.preface}
								</div>
							</div>
							<Button
								onClick={() => setStarted(true)}
								className="w-full bg-primary hover:bg-primary"
							>
								<PlayCircle className="h-4 w-4 mr-2" />
								{data.surveyVariant === 'TEST' ? 'Начать тест' : 'Начать опрос'}
							</Button>
						</div>
					) : (
						<div className="space-y-4">
							<div className="space-y-2">
								<h2 className="text-lg font-medium">
									{currentQuestion.text}
									{currentQuestion.isRequired && (
										<span className="text-red-500 ml-1">*</span>
									)}
								</h2>
								{!currentQuestion.isRequired && (
									<p className="text-sm text-muted-foreground">
										Этот вопрос не обязательный
									</p>
								)}
							</div>

							{renderQuestion()}
							{renderComment()}
						</div>
					)}
				</Card>

				{started && (
					<div className="flex justify-between">
						<Button
							variant="outline"
							onClick={handlePrevious}
							disabled={currentQuestionIndex === 0}
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Назад
						</Button>

						{currentQuestionIndex === data.questions.length - 1 ? (
							<Button
								onClick={handleSubmit}
								disabled={!canProceed || isPending || loadingResults}
							>
								<Send className="h-4 w-4 mr-2" />
								{isPending || loadingResults ? 'Отправка...' : 'Отправить'}
							</Button>
						) : (
							<Button onClick={handleNext} disabled={!canProceed}>
								Далее
								<ArrowRight className="h-4 w-4 ml-2" />
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default TakeSurveyPage;
