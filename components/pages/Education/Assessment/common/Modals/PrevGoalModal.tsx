'use client';

import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Assessment,
	AssessmentStatus,
	Goal,
	GoalType,
} from '@/types/assessment';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import DatePickerPopoverWithFields from '@/components/common/DatePickerPopover/DatePickerPopoverWithFields';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { useCreateGoal } from '@/lib/api/queries/Assessment/mutations/useCreateGoal';
import { useUpdateGoal } from '@/lib/api/queries/Assessment/mutations/useUpdateGoal';
import { Loader2 } from 'lucide-react';

interface GoalModalProps {
	isOpen: boolean;
	onClose: () => void;
	goal?: Goal | null;
	assessment: Assessment;
}

const formSchema = z.object({
	title: z.string().min(1, 'Цель обязательна'),
	result: z.string().optional(),
	employeeRating: z.string().optional(),
	supervisorRating: z.string().optional(),

	dueDate: z.date().optional(),
	type: z.string().optional(),
});

export const PrevGoalModal = ({
	isOpen,
	onClose,
	goal,
	assessment,
}: GoalModalProps) => {
	const { user } = useAuth();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: goal ? goal.title : '',
			result: goal ? goal.result : '',
			employeeRating: goal ? goal.employeeRating?.toString() : undefined,
			supervisorRating: goal ? goal.supervisorRating?.toString() : undefined,
			dueDate: goal?.dueDate ? (new Date(goal?.dueDate) as Date) : undefined,
			type: goal ? goal?.type : GoalType.PLANNED,
		},
	});
	const { mutate: createGoal, isPending: createGoalLoading } = useCreateGoal();
	const { mutate: updateGoal, isPending: updateGoalLoading } = useUpdateGoal();

	const handleSubmit = (values: any) => {
		if (goal) {
			updateGoal(
				{
					...values,
					id: goal.id,
					supervisorRating: values.supervisorRating
						? Number(values.supervisorRating)
						: undefined,
					employeeRating: values.employeeRating
						? Number(values.employeeRating)
						: undefined,
				},
				{ onSettled: () => onClose() },
			);
		} else {
			createGoal(
				{
					...values,
					assessmentId: assessment.id,
					yearType: 'lastYear',
					supervisorRating: values.supervisorRating
						? Number(values.supervisorRating)
						: undefined,
					employeeRating: values.employeeRating
						? Number(values.employeeRating)
						: undefined,
				},
				{ onSettled: () => onClose() },
			);
		}
	};

	const ratingOptions = [
		{ value: '0', label: 'не выполнена (0)' },
		{ value: '1', label: 'частично выполнена (1)' },
		{ value: '2', label: 'полностью выполнена (2)' },
		{ value: '3', label: 'выполнена с превышением (3)' },
	];

	const getDateInputDisabled = (date: Date) => date < new Date('2000-01-01');
	const isEmployeeChange =
		assessment?.status === AssessmentStatus.SELF_ASSESSMENT &&
		user?.id === assessment?.user?.id;
	const isSupervisorReady =
		assessment?.status === AssessmentStatus.SUPERVISOR_ASSESSMENT &&
		user?.id === assessment?.evaluator?.id;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{goal ? 'Редактировать цель' : 'Добавить новую цель'}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<div className="space-y-6 py-4">
							{/* Title */}
							<div className="space-y-2">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Описание цели/задачи по SMART:</FormLabel>
											<FormControl>
												<Textarea rows={4} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Result Description */}
							<div className="space-y-2">
								<FormField
									control={form.control}
									name="result"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Результат выполнения цели/задачи</FormLabel>
											<FormControl>
												<Textarea rows={4} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Employee Rating */}
							{isEmployeeChange && (
								<div className="space-y-3">
									<FormField
										control={form.control}
										name="employeeRating"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Оценка сотрудника</FormLabel>
												<FormControl>
													<RadioGroup
														{...field}
														value={
															field.value !== undefined
																? String(field.value)
																: undefined
														}
														onValueChange={(value) => {
															field.onChange(value);
														}}
													>
														<div className="grid grid-cols-2 gap-4">
															{ratingOptions.map((option) => (
																<div
																	key={`emp-${option.value}`}
																	className="flex items-center space-x-2"
																>
																	<RadioGroupItem
																		value={option.value.toString()}
																		id={`emp-${option.value}`}
																	/>
																	<Label
																		htmlFor={`emp-${option.value}`}
																		className="text-sm"
																	>
																		{option.label}
																	</Label>
																</div>
															))}
														</div>
													</RadioGroup>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							)}

							{/* Manager Rating */}
							{isSupervisorReady && (
								<div className="space-y-3">
									<FormField
										control={form.control}
										name="supervisorRating"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Оценка руководителя</FormLabel>
												<FormControl>
													<RadioGroup
														{...field}
														value={
															field.value !== undefined
																? String(field.value)
																: undefined
														}
														onValueChange={(value) => {
															field.onChange(value);
														}}
													>
														<div className="grid grid-cols-2 gap-4">
															{ratingOptions.map((option) => (
																<div
																	key={`mgr-${option.value}`}
																	className="flex items-center space-x-2"
																>
																	<RadioGroupItem
																		value={option.value.toString()}
																		id={`mgr-${option.value}`}
																	/>
																	<Label
																		htmlFor={`mgr-${option.value}`}
																		className="text-sm"
																	>
																		{option.label}
																	</Label>
																</div>
															))}
														</div>
													</RadioGroup>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							)}

							{/* Due Date and Type */}

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<FormField
										control={form.control}
										name="dueDate"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Планируемый срок исполнения</FormLabel>
												<DatePickerPopoverWithFields
													value={field.value}
													onChange={field.onChange}
													disabled={getDateInputDisabled}
												/>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="space-y-2">
									<FormField
										control={form.control}
										name="type"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Тип цели/задачи</FormLabel>
												<FormControl>
													<Select
														{...field}
														onValueChange={(value) => {
															field.onChange(value);
														}}
													>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value={GoalType.PLANNED}>
																Запланировано
															</SelectItem>
															<SelectItem value={GoalType.REMOVED}>
																Снята
															</SelectItem>
														</SelectContent>
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="flex justify-end space-x-2 pt-4 border-t">
							<Button variant="outline" onClick={onClose} type={'button'}>
								Отмена
							</Button>
							<Button
								type={'submit'}
								disabled={
									form.formState.isSubmitting ||
									createGoalLoading ||
									updateGoalLoading
								}
							>
								{(createGoalLoading || updateGoalLoading) && (
									<Loader2 className={'animate-spin mr-2'} />
								)}
								{goal ? 'Сохранить изменения' : 'Добавить цель'}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
