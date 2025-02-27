'use client';
import React, { useState } from 'react';
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
import useSurvey from '@/lib/api/queries/Surveys/useSurvey';
import { Answer, Question } from '@/types/entities';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { Routes } from '@/const/routes';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import useApi from '@/hooks/useApi';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const TakeSurveyPage = ({ surveyId }: { surveyId: string }) => {
	const { data } = useSurvey(surveyId);
	const { user } = useAuth();
	const router = useRouter();
	const api = useApi();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<Answer[]>([]);
	const [started, setStarted] = useState(false);
	const [showComment, setShowComment] = useState<boolean>(false);

	const { mutateAsync: createResponse, isPending } = useMutation({
		mutationFn: async (responseData: any) => {
			return api.post(`/surveys/response`, {
				...responseData,
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное прохождение опроса',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			toast({
				title: 'Опрос успешно пройден',
				variant: 'default',
			});
		},
	});

	if (!surveyId || !data || !data?.questions?.length || !user?.id) {
		return null;
	}

	const currentQuestion = data.questions[currentQuestionIndex] as Question & {
		id: string;
	};
	const progress = started
		? ((currentQuestionIndex + 1) / data?.questions?.length) * 100
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
				return [...prevAnswers, { questionId: currentQuestion.id, value }];
			}
		});
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
		if (currentQuestionIndex < (data?.questions?.length || 1) - 1) {
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
		const respData = {
			surveyId,
			userId: user.id,
			answers,
		};
		await createResponse(respData);
		router.push(`${Routes.HOME}`);
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

	return (
		<div className="container py-6 space-y-6 m-auto">
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold mb-2">{data.title}</h1>
					<p className="text-muted-foreground">{data.description}</p>
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
								className="w-full bg-primary hover:bg-red-600"
							>
								<PlayCircle className="h-4 w-4 mr-2" />
								Начать опрос
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
								disabled={!canProceed || isPending}
							>
								<Send className="h-4 w-4 mr-2" />
								Отправить
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
