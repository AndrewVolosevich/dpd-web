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
import { defaultCompetencyData } from '@/const/assessment';
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
import { useCreateCompetency } from '@/lib/api/queries/Assessment/mutations/useCreateCompetency';
import { Loader2 } from 'lucide-react';

interface CompetencyModalProps {
	isOpen: boolean;
	onClose: () => void;
	competency: CompetencyWithRatings | null;
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
			'Необходимо указать хотя бы одну оценку (сотрудника или руководителя)',
		path: ['employeeRating'],
	});

export const CompetencyModal = ({
	isOpen,
	onClose,
	competency,
	assessment,
}: CompetencyModalProps) => {
	const { user } = useAuth();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: competency ? competency.title : '',
			employeeRating: competency
				? competency?.employeeRating?.toString()
				: undefined,
			supervisorRating: competency
				? competency?.supervisorRating?.toString()
				: undefined,
		},
	});

	const { mutate: createCompetency, isPending: createCompetencyLoading } =
		useCreateCompetency();

	const isSelfReady =
		(assessment?.status === AssessmentStatus.SELF_ASSESSMENT ||
			assessment?.status === AssessmentStatus.EMPLOYEE_ACKNOWLEDGEMENT) &&
		user?.id === assessment?.user?.id;

	const isSupervisorReady =
		assessment?.status === AssessmentStatus.SUPERVISOR_ASSESSMENT &&
		user?.id === assessment?.evaluator?.id;

	const handleSubmit = (values: any) => {
		createCompetency(
			{ ...values, assessmentId: assessment?.id },
			{ onSettled: () => onClose() },
		);
	};

	if (!competency) return null;
	const criteria = defaultCompetencyData.find(
		(data) => data?.title === competency?.title,
	);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<div className="text-center space-y-2">
						<DialogTitle className="text-2xl font-bold">
							{competency.title.toUpperCase()}
						</DialogTitle>
					</div>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<div className="space-y-6">
							<div className="space-y-3">
								<div className="flex items-start space-x-2">
									<div className="flex-1">
										<h3 className="font-medium mb-2">Сотрудник:</h3>
										<ul className="space-y-1 text-sm">
											{criteria?.employee?.map((criterion, index) => (
												<li key={index} className="flex items-start space-x-2">
													<span className="text-muted-foreground">○</span>
													<span>{criterion}</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>

							{!!criteria?.supervisor?.length && (
								<div className="space-y-3">
									<h3 className="font-medium">
										Для руководителей проявление этой компетенции также
										означает:
									</h3>
									<ul className="space-y-1 text-sm">
										{criteria?.supervisor?.map((criterion, index) => (
											<li key={index} className="flex items-start space-x-2">
												<span className="text-muted-foreground">○</span>
												<span>{criterion}</span>
											</li>
										))}
									</ul>
								</div>
							)}

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
										createCompetencyLoading ||
										assessment?.status === AssessmentStatus.COMPLETED
									}
								>
									{createCompetencyLoading ? (
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
