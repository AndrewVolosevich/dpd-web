'use client';

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAssessment } from '@/lib/api/queries/Assessment/useAssessment';
import { useCurrentAssessment } from '@/lib/api/queries/Assessment/useCurrentAssessment';
import { Stepper } from '@/components/pages/Education/Assessment/common/Stepper/Stepper';
import {
	fullAssessmentSteps,
	simplifiedAssessmentSteps,
} from '@/const/assessment';
import { AssessmentType } from '@/types/assessment';
import FullPageLoader from '@/components/common/Loader/FullPageLoader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PrevGoalTab from '@/components/pages/Education/Assessment/common/Tabs/PrevGoalTab';
import NextGoalTab from '@/components/pages/Education/Assessment/common/Tabs/NextGoalTab';
import CompetencyTab from '@/components/pages/Education/Assessment/common/Tabs/CompetencyTab';
import { useUpdateAssessment } from '@/lib/api/queries/Assessment/mutations/useUpdateAssessment';
import { getAssessmentStatusByStep } from '@/components/pages/Education/Assessment/common/getAssessmentStatusBadge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import MasteryTab from '@/components/pages/Education/Assessment/common/Tabs/MasteryTab';
import GetIsReadyForNextStep from '@/components/pages/Education/Assessment/common/getIsReadyForNextStep';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { UserData } from '@/types/entities';
import { getMasteryLevelRating } from '@/components/pages/Education/Assessment/common/getMasteryLevelText';
import RecommendationsTab from '@/components/pages/Education/Assessment/common/Tabs/RecommendationsTab';

export const AssessmentFormPage = ({
	assessmentId,
}: {
	assessmentId?: string;
}) => {
	const { user: currentUser } = useAuth();
	const { data: assessmentById, isLoading: isAssessmentByIdLoading } =
		useAssessment(assessmentId);
	const { data: currentAssessment, isLoading: isCurrentAssessmentLoading } =
		useCurrentAssessment(!!assessmentId);
	const { mutate: updateStep, isPending: updateStepLoading } =
		useUpdateAssessment();

	const assessment = useMemo(() => {
		if (assessmentById) {
			return assessmentById;
		}
		return currentAssessment;
	}, [assessmentById, currentAssessment]);

	const assessmentSteps =
		assessment?.type === AssessmentType.FULL
			? fullAssessmentSteps
			: simplifiedAssessmentSteps;

	const currentStep =
		assessmentSteps?.findIndex((step) => step?.status === assessment?.status) +
		1; // Индекс шага начинается с 0, поэтому прибавляем 1

	const user = assessment?.user;
	const evaluator = assessment?.evaluator;

	const handleStepChange = (step: number) => {
		if (assessment) {
			updateStep({
				id: assessment?.id,
				status: getAssessmentStatusByStep(step),
			});
		}
	};

	if (!assessment) {
		return (
			<div className={'w-full'}>
				<FullPageLoader />
			</div>
		);
	}

	const isNextReady = GetIsReadyForNextStep(
		assessment,
		currentUser as UserData,
	);

	const supervisorResult =
		((assessment?.averageCompetencySupervisor || 0) +
			(assessment?.averageLastYearSupervisor || 0)) /
		2;

	const supervisorMasteryResult = getMasteryLevelRating(
		assessment?.averageMasteryUser,
	);

	if (isAssessmentByIdLoading || isCurrentAssessmentLoading) {
		return (
			<div className={'w-full'}>
				<FullPageLoader />
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">{`${assessment.year}: Ежегодная оценка`}</h1>
					<p className="text-muted-foreground mt-1">
						{`${user?.surname} ${user?.name} ${user?.patronymic}`}
					</p>
				</div>
				<div className="text-right">
					<div className="text-sm text-muted-foreground">Период оценки</div>
					{assessment?.startDate && assessment?.dueDate && (
						<div className="font-medium">
							с{' '}
							{format(new Date(assessment?.startDate), 'dd MMMM yyyy', {
								locale: ru,
							})}{' '}
							по{' '}
							{format(new Date(assessment?.dueDate), 'dd MMMM yyyy', {
								locale: ru,
							})}
						</div>
					)}
				</div>
			</div>

			{/* Progress Timeline */}
			<Card>
				<CardContent className="pt-6">
					<Stepper
						steps={assessmentSteps}
						currentStep={currentStep}
						onStepChange={handleStepChange}
						isLoading={updateStepLoading}
						isNextDisabled={!isNextReady}
					/>
				</CardContent>
			</Card>

			{/* Employee Cards */}
			<div className="grid md:grid-cols-2 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center space-x-3">
							<Avatar className="h-8 w-8">
								<AvatarImage src={user?.photo} alt="@shadcn" />
								<AvatarFallback>
									{user
										? `${user?.name?.[0]?.toUpperCase()}${user?.surname?.[0]?.toUpperCase()}`
										: ''}
								</AvatarFallback>
							</Avatar>
							<div>
								<div className="font-medium">Оцениваемый сотрудник</div>
								<div className="text-sm text-muted-foreground">
									{`${user?.surname} ${user?.name} ${user?.patronymic}`}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center space-x-3">
							<Avatar className="h-8 w-8">
								<AvatarImage src={evaluator?.photo} alt="@shadcn" />
								<AvatarFallback>
									{user
										? `${evaluator?.name?.[0]?.toUpperCase()}${evaluator?.surname?.[0]?.toUpperCase()}`
										: ''}
								</AvatarFallback>
							</Avatar>
							<div>
								<div className="font-medium">Оценивающий руководитель</div>
								<div className="text-sm text-muted-foreground">
									{`${evaluator?.surname} ${evaluator?.name} ${evaluator?.patronymic}`}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Evaluation Forms Tabs */}
			<Tabs
				defaultValue={
					assessment.type === AssessmentType.FULL ? 'prevGoals' : 'competencies'
				}
				className="space-y-4"
			>
				<TabsList className="grid w-full grid-cols-2 xl:grid-cols-3 mb-12 xl:mb-8">
					{assessment.type === AssessmentType.FULL && (
						<>
							<TabsTrigger value="prevGoals" className="text-xs">
								Оценка целей и задач за {assessment?.year - 1}
							</TabsTrigger>
							<TabsTrigger value="nextGoals" className="text-xs">
								Цели и задачи на {assessment?.year}
							</TabsTrigger>
							<TabsTrigger value="competencies" className="text-xs">
								Оценка компетенций
							</TabsTrigger>
						</>
					)}
					<TabsTrigger value="mastery" className="text-xs">
						Проф. мастерство
					</TabsTrigger>
					<TabsTrigger value="recomendations" className="text-xs">
						Рекомендации
					</TabsTrigger>
					<TabsTrigger value="general" className="text-xs">
						Согласованная оценка
					</TabsTrigger>
				</TabsList>

				<PrevGoalTab assessment={assessment} />

				<MasteryTab assessment={assessment} />

				<CompetencyTab assessment={assessment} />

				<NextGoalTab assessment={assessment} />

				<RecommendationsTab assessment={assessment} />

				<TabsContent value="general" className="space-y-4">
					<Card>
						<CardContent className="p-6">
							<div className="text-center space-y-4">
								<h3 className="text-lg font-medium">Согласованная оценка</h3>
								<div className="grid grid-cols-1 gap-4">
									<Card>
										<CardContent className="p-4 text-center">
											<div className="text-sm text-muted-foreground">
												Итоговая оценка по всем критериям
											</div>
											{assessment.type !== AssessmentType.SIMPLIFIED && (
												<div className="text-2xl font-bold text-red-500">
													{supervisorResult.toFixed(2)}
												</div>
											)}
											<div className="text-sm text-muted-foreground mt-6">
												Уровень мастерства
											</div>
											<div className="text-xl text-red-500">
												{`${supervisorMasteryResult?.title} (${assessment?.averageMasterySupervisor})`}
											</div>
											<div className="text-md text-muted-foreground">
												{supervisorMasteryResult?.description}
											</div>
										</CardContent>
									</Card>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};
