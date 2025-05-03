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
import { ListPlus, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Routes } from '@/const/routes';
import { toast } from '@/hooks/use-toast';
import {
	Question,
	QuestionType,
	RatingType,
	Survey,
	SurveyStatus,
	SurveyVariant,
} from '@/types/entities';
import { useNonAdminRedirect } from '@/hooks/useNonAdminRedirect';
import { validateSurvey } from '@/lib/validators/surveys';
import { useRouter } from 'next/navigation';
import { BulkOptionsModal } from '@/components/common/BulkOptionsModal/BulkOptionsModal';
import QuestionPreview from '@/components/pages/Admin/Surveys/SurveyForm/QuestionPreview';
import DatePickerPopover from '@/components/common/DatePickerPopover/DatePickerPopover';
import { MatrixQuestion } from '@/components/pages/Admin/Surveys/SurveyForm/MatrixQuestion';
import { getStartDateISO } from '@/lib/date/helpers';
import { PhotoQuestion } from '@/components/pages/Admin/Surveys/SurveyForm/PhotoQuestion';
import { useUpdateSurvey } from '@/lib/api/queries/Education/mutations/survey/useUpdateSurvey';
import { useCreateSurvey } from '@/lib/api/queries/Education/mutations/survey/useCreateSurvey';

export function SurveyForm({
	initialData,
	forCopy = false,
}: {
	initialData?: Survey;
	forCopy?: boolean;
}) {
	useNonAdminRedirect(`${Routes.ADMIN}/surveys`);
	const [title, setTitle] = useState(initialData?.title || '');
	const [endDate, setEndDate] = useState(
		initialData?.endDate ? (new Date(initialData?.endDate) as Date) : undefined,
	);
	const [description, setDescription] = useState(
		initialData?.description || '',
	);
	const [preface, setPreface] = useState(initialData?.preface || '');
	const [type, setType] = useState(initialData?.type || 'PERSONALIZED');
	const [status, setStatus] = useState(initialData?.status || 'DRAFT');
	const [surveyVariant, setSurveyVariant] = useState(
		initialData?.surveyVariant || 'SURVEY',
	);
	const [showForAll, setShowForAll] = useState(initialData?.showForAll);

	const [questions, setQuestions] = useState<Question[]>(
		initialData?.questions || [
			{
				type: 'OPEN_TEXT',
				text: '',
				options: [],
				isRequired: true,
			},
		],
	);

	const router = useRouter();
	const { mutateAsync: createSurvey, isPending: createLoading } =
		useCreateSurvey();
	const { mutateAsync: updateSurvey, isPending: updateLoading } =
		useUpdateSurvey();

	const addQuestion = () => {
		setQuestions([
			...questions,
			{
				type: 'OPEN_TEXT',
				text: '',
				options: [],
				isRequired: true,
			},
		]);
	};

	const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
	const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
		number | null
	>(null);

	const handleBulkAdd = (newOptions: string[]) => {
		if (selectedQuestionIndex === null) return;
		setQuestions((prev) => {
			const updated = [...prev];

			const existingOptions = new Set(
				updated[selectedQuestionIndex].options.map((o) => o.value),
			);
			const uniqueOptions = newOptions.filter(
				(option) => !existingOptions.has(option),
			);

			updated[selectedQuestionIndex].options = [
				...updated[selectedQuestionIndex].options,
				...uniqueOptions.map((option) => ({ value: option, correct: false })),
			];

			return updated;
		});

		setSelectedQuestionIndex(null);
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
		const updatedQuestions = forCopy
			? questions?.map((q) => {
					delete (q as any)?.surveyId;
					delete q?.answers;
					delete q?.id;
					return q;
				})
			: questions;
		const surveyData = {
			title,
			description,
			preface,
			showForAll,
			endDate: getStartDateISO(endDate),
			type,
			surveyVariant,
			status: (status || 'DRAFT') as SurveyStatus,
			questions: updatedQuestions,
			...(initialData?.id && !forCopy ? { id: initialData.id } : {}),
		};
		const isValid = validateSurvey(surveyData);

		if (!isValid) {
			toast({
				title: 'Опрос не может быть создан, вы указали не все необходимые поля',
				variant: 'default',
			});
			return;
		}
		if (initialData && !forCopy) {
			await updateSurvey(surveyData);
		} else {
			await createSurvey(surveyData);
		}

		router.push(`${Routes.ADMIN}/surveys`);
	};

	return (
		<div className="container py-6 space-y-6 m-auto">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">
					{initialData && !forCopy ? 'Редактировать опрос' : 'Создать опрос'}
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

			<div className="space-y-6 max-w-6xl mx-auto">
				<div className="space-y-4">
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

					<div className="flex items-center space-x-2">
						<DatePickerPopover
							value={endDate}
							onChange={setEndDate}
							title={'Введите дату окончания'}
						/>
					</div>

					<div className="flex flex-col items-center space-x-2">
						<Select
							value={status}
							onValueChange={(value) => setStatus(value as SurveyStatus)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Выберите статус" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="DRAFT">Черновик</SelectItem>
								<SelectItem value="ACTIVE">Активный</SelectItem>
								<SelectItem value="COMPLETED">Завершен</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col items-center space-x-2">
						<Select
							value={surveyVariant}
							onValueChange={(value) =>
								setSurveyVariant(value as SurveyVariant)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Выберите тип" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="SURVEY">Опрос</SelectItem>
								<SelectItem value="TEST">Тест</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center space-x-2">
						<Switch
							id="show-for-all"
							checked={showForAll}
							onCheckedChange={() => {
								setShowForAll(!showForAll);
							}}
						/>
						<Label htmlFor="show-for-all">
							Показать для всех на главной странице
						</Label>
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
				<div className="space-y-4">
					{questions.map((q, qIndex) => (
						<Card key={q.id || qIndex}>
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
										<SelectItem value="MATRIX">Матрица</SelectItem>
										<SelectItem value="PHOTO">Голосование за фото</SelectItem>
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

								<div className="flex items-center space-x-2">
									<Switch
										id={`allowComment-${q.id}`}
										checked={q?.allowComment}
										onCheckedChange={(checked) => {
											const newQuestions = [...questions];
											newQuestions[qIndex].allowComment = checked;
											setQuestions(newQuestions);
										}}
									/>
									<Label htmlFor={`allowComment-${q.id}`}>
										Разрешить комментарий к вопросу
									</Label>
								</div>

								{q.type === 'OPEN_TEXT' && (
									<Input disabled placeholder="Поле для ответа" />
								)}

								{q.type === 'MATRIX' && (
									<MatrixQuestion
										question={{
											rows: q.ratingConfig?.rows || [],
											columns: q.ratingConfig?.columns || [],
										}}
										onChange={({ rows, columns }) => {
											const newQuestions = [...questions];
											if (newQuestions[qIndex]) {
												if (!newQuestions[qIndex].ratingConfig) {
													newQuestions[qIndex].ratingConfig = {
														rows: [],
														columns: [],
														type: 'MATRIX',
														maxValue: undefined,
														leftLabel: undefined,
														rightLabel: undefined,
													};
												}
												if (rows !== undefined)
													newQuestions[qIndex].ratingConfig!.rows = rows;
												if (columns !== undefined)
													newQuestions[qIndex].ratingConfig!.columns = columns;
												setQuestions(newQuestions);
											}
										}}
									/>
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
														checked={option.correct}
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
														{surveyVariant === 'TEST' && (
															<Checkbox
																checked={option.correct}
																onCheckedChange={() =>
																	toggleCorrect(qIndex, optionIndex)
																}
																className="ml-2"
															/>
														)}
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
										<div>
											<Button
												variant="outline"
												size="sm"
												onClick={() => addOption(qIndex)}
												className={'mb-2'}
											>
												<PlusCircle className="h-4 w-4 mr-2" /> Добавить вариант
											</Button>
											<br />
											<Button
												variant="outline"
												size="sm"
												onClick={() => {
													setSelectedQuestionIndex(qIndex);
													setIsBulkModalOpen(true);
												}}
											>
												<ListPlus className="h-4 w-4 mr-2" />
												Добавить несколько
											</Button>
										</div>
										{surveyVariant === 'TEST' && (
											<div className="mt-2 p-2 bg-muted rounded-md">
												<Label className="text-sm">
													Отметьте правильные варианты ответов
												</Label>
											</div>
										)}
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
										<div>
											<Button
												variant="outline"
												size="sm"
												onClick={() => addOption(qIndex)}
												className={'mb-2'}
											>
												<PlusCircle className="h-4 w-4 mr-2" /> Добавить вариант
											</Button>
											<br />
											<Button
												variant="outline"
												size="sm"
												onClick={() => {
													setSelectedQuestionIndex(qIndex);
													setIsBulkModalOpen(true);
												}}
											>
												<ListPlus className="h-4 w-4 mr-2" />
												Добавить несколько
											</Button>
										</div>
										{surveyVariant === 'TEST' && (
											<div className="mt-2 p-2 bg-muted rounded-md">
												<Label className="text-sm">
													Отметьте правильные варианты ответов
												</Label>
											</div>
										)}
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
													leftLabel: '',
													rightLabel: '',
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
											<div className="flex gap-2 flex-col items-start">
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
												<div className="flex-col w-full">
													<div className="space-y-2 mb-2">
														<Label>Метка слева</Label>
														<Input
															placeholder="например: Крайне негативно"
															value={q.ratingConfig.leftLabel || ''}
															onChange={(e) => {
																const newQuestions = [...questions];
																if (newQuestions[qIndex].ratingConfig) {
																	newQuestions[qIndex].ratingConfig.leftLabel =
																		e.target.value;
																}
																setQuestions(newQuestions);
															}}
														/>
													</div>
													<div className="space-y-2">
														<Label>Метка справа</Label>
														<Input
															placeholder="например: Крайне позитивно"
															value={q.ratingConfig.rightLabel || ''}
															onChange={(e) => {
																const newQuestions = [...questions];
																if (newQuestions[qIndex].ratingConfig) {
																	newQuestions[qIndex].ratingConfig.rightLabel =
																		e.target.value;
																}
																setQuestions(newQuestions);
															}}
														/>
													</div>
												</div>
											</div>
										)}

										<div className="border rounded-lg p-4 bg-muted/50">
											<Label className="block mb-2">Предпросмотр:</Label>
											<QuestionPreview question={q} />
										</div>
									</div>
								)}
								{q.type === 'PHOTO' && (
									<PhotoQuestion
										question={{
											photos: q.photos || [],
											allowMultipleSelection:
												q?.allowMultipleSelection || false,
										}}
										onChange={({ photos, allowMultipleSelection }) => {
											const newQuestions = [...questions];
											if (photos !== undefined)
												newQuestions[qIndex].photos = photos;
											if (allowMultipleSelection !== undefined)
												newQuestions[qIndex].allowMultipleSelection =
													allowMultipleSelection;
											setQuestions(newQuestions);
										}}
									/>
								)}
							</CardContent>
						</Card>
					))}
					<BulkOptionsModal
						isOpen={isBulkModalOpen}
						onClose={() => setIsBulkModalOpen(false)}
						onAdd={handleBulkAdd}
					/>
					<Button variant="outline" onClick={addQuestion}>
						<PlusCircle className="h-4 w-4 mr-2" />
						Добавить вопрос
					</Button>
				</div>
			</div>
		</div>
	);
}
