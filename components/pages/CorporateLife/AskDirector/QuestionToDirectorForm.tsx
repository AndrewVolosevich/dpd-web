import React from 'react';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useCreateQuestionToDirector } from '@/lib/api/queries/Content/mutations/question-to-director/useCreateQuestionToDirector';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { QuestionToDirector, QuestionToDirectorStatus } from '@/types/content';
import { useEditQuestionToDirector } from '@/lib/api/queries/Content/mutations/question-to-director/useEditQuestionToDirector';
import { Loader2 } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { categories } from '@/const/content';

interface AskQuestionEditProps extends React.HTMLAttributes<HTMLDivElement> {
	question: QuestionToDirector | null;
	className?: string;
	onClose?: () => void;
}

const formSchema = z.object({
	title: z.string().max(120).min(1, 'Заголовок не может быть пустым'),
	description: z.string().min(1, 'Описание не может быть пустым'),
	category: z.string().min(1, 'Категория не может быть пустой'),
	directorAnswer: z.string().optional(),
});

const QuestionToDirectorForm = ({
	question,
	className,
	onClose,
	...props
}: AskQuestionEditProps) => {
	const { isAdmin } = useAuth();
	const { mutate: createQuestion, isPending: createLoading } =
		useCreateQuestionToDirector();
	const { mutate: updateQuestion, isPending: updateLoading } =
		useEditQuestionToDirector();
	const { user } = useAuth();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		mode: 'onBlur',
		defaultValues: {
			title: question?.title ?? '',
			description: question?.description ?? '',
			category: question?.category ?? '',
		},
	});

	const submitDisabled = !!form.formState.errors.title?.message;

	const handleClose = () => {
		form.reset();
		onClose?.();
	};

	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		if (question) {
			updateQuestion(
				{
					...values,
					id: question.id,
				},
				{
					onSettled: () => {
						handleClose();
					},
				},
			);
		} else {
			createQuestion(
				{ ...values, userId: user?.id },
				{
					onSettled: () => {
						handleClose();
					},
				},
			);
		}
	};

	return (
		<div className={cn('grid gap-4', className)} {...props}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
					<div className="grid gap-3">
						<div className="grid gap-1">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Кратко вопрос (тема)</FormLabel>
											<FormControl>
												<Input
													placeholder={'Краткое описание вопроса'}
													maxLength={120}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
						</div>

						<div className="grid gap-1">
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Сфера деятельности</FormLabel>
											<FormControl>
												<Select
													onValueChange={(value) => field.onChange(value)}
													defaultValue={field.value}
												>
													<SelectTrigger>
														<SelectValue placeholder="Выберите сферу деятельности" />
													</SelectTrigger>
													<SelectContent>
														{categories.map((category) => (
															<SelectItem key={category} value={category}>
																{category}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
						</div>

						<div className="grid gap-1">
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Описание вопроса</FormLabel>
											<FormControl>
												<Textarea
													rows={5}
													placeholder={
														'Подробно опишите ваш вопрос или предложение...'
													}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
						</div>

						{question?.status === QuestionToDirectorStatus.APPROVED &&
							isAdmin && (
								<div className="grid gap-1">
									<FormField
										control={form.control}
										name="directorAnswer"
										render={({ field }) => {
											return (
												<FormItem>
													<FormLabel>Ответ директора</FormLabel>
													<FormControl>
														<Textarea
															rows={5}
															placeholder={'Ответ ...'}
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											);
										}}
									/>
								</div>
							)}
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={handleClose}>
							Отмена
						</Button>
						<Button
							type="submit"
							className="bg-primary hover:brightness-90"
							disabled={submitDisabled || createLoading || updateLoading}
						>
							{(createLoading || updateLoading) && (
								<Loader2 className="animate-spin mr-2 " />
							)}
							{question ? 'Редактировать' : 'Отправить на модерацию'}
						</Button>
					</DialogFooter>
				</form>
			</Form>
		</div>
	);
};

export default QuestionToDirectorForm;
