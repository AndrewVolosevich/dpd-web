'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Routes } from '@/const/routes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import useApi from '@/hooks/useApi';
import {
	Question,
	QuestionType,
	RatingType,
	Survey,
	SurveyStatus,
} from '@/types/entities';
import { useNonAdminRedirect } from '@/hooks/useNonAdminRedirect';
import { validateSurvey } from '@/lib/validators/surveys';
import { useRouter } from 'next/navigation';

export function SurveyForm({ initialData }: { initialData?: Survey }) {
	useNonAdminRedirect(`${Routes.ADMIN}/surveys`);
	const [title, setTitle] = useState(initialData?.title || '');
	const [description, setDescription] = useState(
		initialData?.description || '',
	);
	const [preface, setPreface] = useState(initialData?.preface || '');
	const [afterword, setAfterword] = useState(initialData?.afterword || '');
	const [type, setType] = useState(initialData?.type || 'ANONYMOUS');

	const [questions, setQuestions] = useState<Question[]>(
		initialData?.questions || [
			{
				type: 'OPEN_TEXT',
				text: '',
				options: [],
				isRequired: false,
			},
		],
	);

	const router = useRouter();
	const api = useApi();
	const queryClient = useQueryClient();
	const { mutateAsync: createSurvey, isPending: createLoading } = useMutation({
		mutationFn: async (surveyData: any) => {
			return api.post(`/surveys`, {
				...surveyData,
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное создание опроса',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['surveys-list'] });
			toast({
				title: 'Опрос успешно создан',
				variant: 'default',
			});
		},
	});

	const { mutateAsync: updateSurvey, isPending: updateLoading } = useMutation({
		mutationFn: async (surveyData: any) => {
			return api.put(`/surveys/${surveyData.id}`, {
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

	const addQuestion = () => {
		setQuestions([
			...questions,
			{
				type: 'OPEN_TEXT',
				text: '',
				options: [],
				isRequired: false,
			},
		]);
	};

	const updateQuestion = <K extends keyof Question>(
		index: number,
		field: K,
		value: Question[K],
	) => {
		setQuestions((prev) => {
			const updated = [...prev];
			updated[index] = { ...updated[index], [field]: value };
			return updated;
		});
	};

	const addOption = (index: number) => {
		const updated = [...questions];
		updated[index].options.push({ value: '', correct: false });
		setQuestions(updated);
	};

	const updateOption = (qIndex: number, oIndex: number, value: string) => {
		const updated = [...questions];
		updated[qIndex].options[oIndex].value = value;
		setQuestions(updated);
	};

	const toggleCorrect = (qIndex: number, oIndex: number) => {
		const updated = [...questions];
		updated[qIndex].options[oIndex].correct =
			!updated[qIndex].options[oIndex].correct;
		setQuestions(updated);
	};

	const setCorrectAnswer = (qIndex: number, oIndex: number) => {
		setQuestions((prev) => {
			const updated = [...prev];
			updated[qIndex].options = updated[qIndex].options.map((o, index) => ({
				...o,
				correct: index === oIndex,
			}));
			return updated;
		});
	};

	const removeOption = (qIndex: number, oIndex: number) => {
		const updated = [...questions];
		updated[qIndex].options.splice(oIndex, 1);
		setQuestions(updated);
	};

	const removeQuestion = (index: number) => {
		const updated = questions.filter((_, i) => i !== index);
		setQuestions(updated);
	};

	const handleSubmit = async () => {
		const surveyData = {
			title,
			description,
			preface,
			afterword,
			type,
			status: 'DRAFT' as SurveyStatus,
			questions,
			...(initialData?.id ? { id: initialData.id } : {}),
		};
		const isValid = validateSurvey(surveyData);

		if (!isValid) {
			toast({
				title: 'Опрос не может быть создан, вы указали не все необходимые поля',
				variant: 'default',
			});
			return;
		}
		if (initialData) {
			await updateSurvey(surveyData);
		} else {
			await createSurvey(surveyData);
		}

		router.push(`${Routes.ADMIN}/surveys`);
	};

	const renderRatingPreview = (question: Question) => {
		if (!question.ratingConfig) return null;

		switch (question.ratingConfig.type) {
			case 'EMOTIONS':
				return (
					<div className="flex gap-4 items-center justify-center">
						{['😡', '🙁', '😐', '🙂', '😊'].map((emoji, index) => (
							<button
								key={index}
								className="text-2xl hover:scale-110 transition-transform"
								type="button"
							>
								{emoji}
							</button>
						))}
					</div>
				);
			case 'STARS':
				return (
					<div className="flex gap-1">
						{Array.from({ length: 5 }, (_, i) => (
							<Button key={i} variant="outline" size="lg" className="p-2">
								<Star className="h-6 w-6" />
							</Button>
						))}
					</div>
				);
			case 'SCALE':
				return (
					<div className="flex gap-2 flex-wrap">
						{Array.from(
							{ length: question.ratingConfig.maxValue || 10 },
							(_, i) => (
								<Button
									key={i}
									variant="outline"
									size="sm"
									className="w-10 h-10"
								>
									{i + 1}
								</Button>
							),
						)}
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="container py-6 space-y-6 m-auto">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">
					{initialData ? 'Редактировать опрос' : 'Создать опрос'}
				</h1>
				<div className="flex gap-2">
					<Button variant="buttonLink" href={`${Routes.ADMIN}/surveys`}>
						Отмена
					</Button>
					<Button
						disabled={createLoading || updateLoading}
						onClick={handleSubmit}
						className="bg-primary"
					>
						Сохранить
					</Button>
				</div>
			</div>

			<div className="space-y-6 max-w-3xl">
				<div key={'1'} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Название</Label>
						<Input
							id="title"
							placeholder="Введите название опроса"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Описание</Label>
						<Textarea
							id="description"
							placeholder="Вы можете написать рекомендации к тесту или добавить его описание"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="preface">Вступительное слово</Label>
						<Textarea
							id="preface"
							placeholder="Вступительное слово"
							value={preface}
							onChange={(e) => setPreface(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="afterword">Заключительное слово</Label>
						<Textarea
							id="afterword"
							value={afterword}
							onChange={(e) => setAfterword(e.target.value)}
							placeholder="Заключительное слово"
						/>
					</div>

					<div className="flex items-center space-x-2">
						<Switch
							id="collect-info"
							checked={type === 'PERSONALIZED'}
							onCheckedChange={() => {
								if (type === 'PERSONALIZED') {
									setType('ANONYMOUS');
								} else {
									setType('PERSONALIZED');
								}
							}}
						/>
						<Label htmlFor="collect-info">
							Собирать информацию об участниках?
						</Label>
					</div>
				</div>
				<div key={'2'} className="space-y-4">
					{questions.map((q, qIndex) => (
						<Card key={q.id}>
							<CardContent className="pt-6 space-y-4">
								<div className="flex justify-between">
									<Label>Вопрос {qIndex + 1}</Label>
									<Button
										variant="ghost"
										size="sm"
										className="text-red-500 hover:text-red-600"
										onClick={() => removeQuestion(qIndex)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
								<Select
									value={q.type}
									onValueChange={(value) =>
										updateQuestion(qIndex, 'type', value as QuestionType)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Выберите тип вопроса" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="OPEN_TEXT">Открытый вопрос</SelectItem>
										<SelectItem value="SINGLE_CHOICE">
											Один вариант ответа
										</SelectItem>
										<SelectItem value="MULTIPLE_CHOICE">
											Несколько вариантов
										</SelectItem>
										<SelectItem value="RATING">Оценка</SelectItem>
									</SelectContent>
								</Select>

								<Textarea
									value={q.text}
									onChange={(e) =>
										updateQuestion(qIndex, 'text', e.target.value)
									}
									placeholder="Текст вопроса"
								/>

								<div className="flex items-center space-x-2">
									<Switch
										id={`required-${q.id}`}
										checked={q.isRequired}
										onCheckedChange={(checked) => {
											const newQuestions = [...questions];
											newQuestions[qIndex].isRequired = checked;
											setQuestions(newQuestions);
										}}
									/>
									<Label htmlFor={`required-${q.id}`}>
										Обязательный вопрос
									</Label>
								</div>

								{q.type === 'OPEN_TEXT' && (
									<Input disabled placeholder="Поле для ответа" />
								)}

								{q.type === 'SINGLE_CHOICE' && (
									<div className="space-y-2">
										<RadioGroup
											onValueChange={(value) =>
												setCorrectAnswer(qIndex, Number(value))
											}
											className="space-y-2"
										>
											{q.options.map((option, optionIndex) => (
												<div
													key={optionIndex}
													className="flex items-center space-x-2"
												>
													<RadioGroupItem
														value={`${optionIndex}`}
														id={`${optionIndex}`}
													/>
													<div className="flex-1 flex items-center space-x-2">
														<Input
															value={option.value}
															onChange={(e) =>
																updateOption(
																	qIndex,
																	optionIndex,
																	e.target.value,
																)
															}
															placeholder={`Вариант ответа ${optionIndex + 1}`}
														/>
														<Button
															variant="ghost"
															size="sm"
															className="text-red-500"
															onClick={() => removeOption(qIndex, optionIndex)}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
											))}
										</RadioGroup>
										<Button
											variant="outline"
											size="sm"
											onClick={() => addOption(qIndex)}
										>
											<PlusCircle className="h-4 w-4 mr-2" />
											Добавить вариант
										</Button>
									</div>
								)}

								{q.type === 'MULTIPLE_CHOICE' && (
									<div className="space-y-2">
										{q.options.map((option, oIndex) => (
											<div key={oIndex} className="flex items-center space-x-2">
												<Checkbox
													checked={option.correct}
													onCheckedChange={() => toggleCorrect(qIndex, oIndex)}
												/>
												<Input
													value={option.value}
													onChange={(e) =>
														updateOption(qIndex, oIndex, e.target.value)
													}
													placeholder={`Вариант ответа ${oIndex + 1}`}
												/>
												<Button
													variant="ghost"
													size="sm"
													className="text-red-500"
													onClick={() => removeOption(qIndex, oIndex)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))}
										<Button
											variant="outline"
											size="sm"
											onClick={() => addOption(qIndex)}
										>
											<PlusCircle className="h-4 w-4 mr-2" /> Добавить вариант
										</Button>
									</div>
								)}

								{q.type === 'RATING' && (
									<div className="space-y-4">
										<Select
											value={q.ratingConfig?.type}
											onValueChange={(value: RatingType) => {
												const newQuestions = [...questions];
												newQuestions[qIndex].ratingConfig = {
													type: value,
													maxValue: value === 'SCALE' ? 10 : undefined,
												};
												setQuestions(newQuestions);
											}}
										>
											<SelectTrigger>
												<SelectValue placeholder="Выберите тип оценки" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="EMOTIONS">Эмоции</SelectItem>
												<SelectItem value="STARS">Звезды</SelectItem>
												<SelectItem value="SCALE">Шкала</SelectItem>
											</SelectContent>
										</Select>

										{q.ratingConfig?.type === 'SCALE' && (
											<div className="flex items-center gap-2">
												<Label>Максимальное значение:</Label>
												<Select
													value={String(q.ratingConfig.maxValue || 10)}
													onValueChange={(value) => {
														const newQuestions = [...questions];
														if (newQuestions[qIndex].ratingConfig) {
															newQuestions[qIndex].ratingConfig.maxValue =
																Number(value);
														}
														setQuestions(newQuestions);
													}}
												>
													<SelectTrigger className="w-20">
														<SelectValue placeholder="10" />
													</SelectTrigger>
													<SelectContent>
														{Array.from({ length: 10 }, (_, i) => (
															<SelectItem key={i + 1} value={String(i + 1)}>
																{i + 1}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										)}

										<div className="border rounded-lg p-4 bg-muted/50">
											<Label className="block mb-2">Предпросмотр:</Label>
											{renderRatingPreview(q)}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					))}

					<Button variant="outline" onClick={addQuestion}>
						<PlusCircle className="h-4 w-4 mr-2" />
						Добавить вопрос
					</Button>
				</div>
			</div>
		</div>
	);
}
