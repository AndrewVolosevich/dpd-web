'use client';

import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Assessment, Goal } from '@/types/assessment';
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
	dueDate: z.date().optional(),
});

export const NextGoalModal = ({
	isOpen,
	onClose,
	goal,
	assessment,
}: GoalModalProps) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: goal ? goal.title : '',
			dueDate: goal?.dueDate ? (new Date(goal?.dueDate) as Date) : undefined,
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
				},
				{ onSettled: () => onClose() },
			);
		} else {
			createGoal(
				{
					...values,
					assessmentId: assessment.id,
					yearType: 'nextYear',
				},
				{ onSettled: () => onClose() },
			);
		}
	};

	const getDateInputDisabled = (date: Date) => date < new Date('2000-01-01');

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{goal ? 'Редактировать цель' : 'Добавить новую цель'}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-2 py-2">
					<div className="text-sm text-gray-500">
						Цели, поставленные не по SMART, будут возвращены на доработку.
					</div>
					<div>Инструкция по постановке целей по SMART:</div>
					<div className={'text-sm'}>
						<div>
							<span className={'text-md text-primary'}>S (Конкретность)</span> -
							Напишите, что необходимо сделать, какого результата достичь.
						</div>
						<div>
							<span className={'text-md text-primary'}>M (Измеримость)</span> -
							Добавьте в цель показатель измеримости (например, шт., %, руб. и
							т.д.).
						</div>
						<div>
							<span className={'text-md text-primary'}>A (Достижимость)</span> -
							Ответьте на вопросы: достижима ли цель, находится ли она в зоне
							моего влияния/в зоне влияния моего подчиненного. Если «да» —
							продолжайте описывать цель, «нет» — измените цель.
						</div>
						<div>
							<span className={'text-md text-primary'}>R (Релевантность)</span>{' '}
							- Ответьте на вопросы: Как цель взаимосвязана с целью
							отдела/подразделения/компании. Для чего достигается цель.
						</div>
						<div>
							<span className={'text-md text-primary'}>
								T (Ограничение по времени)
							</span>{' '}
							- Укажите срок выполнения, когда цель должна быть достигнута.
						</div>
					</div>
				</div>
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
