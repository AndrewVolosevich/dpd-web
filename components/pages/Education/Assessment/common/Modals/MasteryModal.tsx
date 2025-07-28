'use client';

import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Assessment,
	AssessmentStatus,
	CompetencyWithRatings,
} from '@/types/assessment';
import { defaultMasteryData } from '@/const/assessment';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCompetencyRating } from '@/components/pages/Education/Assessment/common/getCompetencyRating';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { getMasteryLevelText } from '@/components/pages/Education/Assessment/common/getMasteryLevelText';
import { useCreateMastery } from '@/lib/api/queries/Assessment/mutations/useCreateMastery';
import { Loader2 } from 'lucide-react';

interface CompetencyModalProps {
	isOpen: boolean;
	onClose: () => void;
	mastery: CompetencyWithRatings | null;
	assessment?: Assessment;
}

const formSchema = z
	.object({
		title: z.string().optional(),
		employeeRating: z.string().optional(),
		supervisorRating: z.string().optional(),
	})
	.refine((data) => data.employeeRating || data.supervisorRating, {
		message:
			'Необходимо указать хотя бы один уровень (сотрудника или руководителя)',
		path: ['employeeRating'],
	});

export const MasteryModal = ({
	isOpen,
	onClose,
	mastery,
	assessment,
}: CompetencyModalProps) => {
	const { user } = useAuth();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: mastery ? mastery.title : '',
			employeeRating: mastery ? mastery?.employeeRating?.toString() : undefined,
			supervisorRating: mastery
				? mastery?.supervisorRating?.toString()
				: undefined,
		},
	});

	const { mutate: createMastery, isPending: createMasteryLoading } =
		useCreateMastery();

	const isSupervisorReady =
		assessment?.status === AssessmentStatus.SUPERVISOR_ASSESSMENT &&
		user?.id === assessment?.evaluator?.id;

	const isSelfReady =
		(assessment?.status === AssessmentStatus.SELF_ASSESSMENT ||
			assessment?.status === AssessmentStatus.EMPLOYEE_ACKNOWLEDGEMENT) &&
		user?.id === assessment?.user?.id;

	const handleSubmit = (values: any) => {
		createMastery(
			{ ...values, assessmentId: assessment?.id },
			{ onSettled: () => onClose() },
		);
	};

	if (!mastery) return null;
	const criteria = defaultMasteryData.find(
		(data) => data?.title === mastery?.title,
	);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<div className="text-center space-y-2">
						<DialogTitle className="text-2xl font-bold">
							{mastery.title.toUpperCase()}
						</DialogTitle>
					</div>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<div className="space-y-6">
							<div className="space-y-3">
								<div className="flex flex-col">
									{criteria?.value?.map((criterion, index) => (
										<div key={index} className="flex-1 text-sm">
											<h3 className="mt-2 text-primary">
												{getMasteryLevelText(index)}
											</h3>
											<span>{criterion}</span>
										</div>
									))}
								</div>
							</div>

							{isSelfReady && (
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
															{[0, 1, 2, 3].map((option) => (
																<div
																	key={`mgr-${option}`}
																	className="flex items-center space-x-2"
																>
																	<RadioGroupItem
																		value={option.toString()}
																		id={`mgr-${option}`}
																	/>
																	<Label
																		htmlFor={`mgr-${option}`}
																		className="text-sm"
																	>
																		{getMasteryLevelText(option)}
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
															{[0, 1, 2, 3].map((option) => (
																<div
																	key={`mgr-${option}`}
																	className="flex items-center space-x-2"
																>
																	<RadioGroupItem
																		value={option.toString()}
																		id={`mgr-${option}`}
																	/>
																	<Label
																		htmlFor={`mgr-${option}`}
																		className="text-sm"
																	>
																		{getCompetencyRating(option)}
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

							{/* Actions */}
							<div className="flex justify-end space-x-2 pt-4">
								<Button variant="outline" onClick={onClose}>
									Отмена
								</Button>
								<Button
									type={'submit'}
									disabled={
										form.formState.isSubmitting ||
										createMasteryLoading ||
										assessment?.status === AssessmentStatus.COMPLETED
									}
								>
									{createMasteryLoading ? (
										<Loader2 className="animate-spin mr-2" />
									) : null}
									Сохранить
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
