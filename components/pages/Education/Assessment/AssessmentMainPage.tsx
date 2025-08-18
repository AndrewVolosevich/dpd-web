'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Star, User, Users } from 'lucide-react';
import Link from 'next/link';
import { useCurrentAssessment } from '@/lib/api/queries/Assessment/useCurrentAssessment';
import { getAssessmentTypeBadge } from '@/components/pages/Education/Assessment/common/getAssessmentTypeBadge';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { useSubordinateUserAssessments } from '@/lib/api/queries/Assessment/useSubordinateUserAssessments';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAssessmentStatusBadge } from '@/components/pages/Education/Assessment/common/getAssessmentStatusBadge';
import { Assessment, AssessmentType } from '@/types/assessment';
import { exportGeneralAssessmentGroupedByDepartment } from '@/lib/assessmentToCsv';

export const AssessmentMainPage = () => {
	const { user } = useAuth();
	const isSupervisor = !!user?.roles?.some((r) => r === 'SUPERVISOR');
	const { data: currentUserAssessment } = useCurrentAssessment();
	const { data: subordinateUserAssessments } =
		useSubordinateUserAssessments(isSupervisor);

	const subordinateAssessments = subordinateUserAssessments
		?.map((uA) => {
			const assessment = uA?.assessment?.find(
				(a) => a.year === new Date().getFullYear(),
			);

			return { ...assessment, user: uA };
		})
		.filter((a) => !!a) as Assessment[];

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Ежегодная оценка</h1>
					<p className="text-muted-foreground mt-2">
						Управление процессом ежегодной оценки
					</p>
				</div>
			</div>

			{/* Моя оценка */}
			<Card>
				<CardHeader className="bg-gradient-to-r from-primary to-red-600 text-white">
					<CardTitle className="flex items-center space-x-2">
						<User className="w-6 h-6" />
						<span>Моя оценка</span>
					</CardTitle>
				</CardHeader>
				{currentUserAssessment && (
					<CardContent className="p-6">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										{getAssessmentTypeBadge(currentUserAssessment?.type)}
										{getAssessmentStatusBadge(currentUserAssessment.status)}
									</div>
									<div className="text-md text-muted-foreground mt-4">
										<div>
											Оценивающий:{' '}
											{`${currentUserAssessment?.evaluator?.name} ${currentUserAssessment?.evaluator?.surname}`}
										</div>
									</div>
								</div>
							</div>

							{(currentUserAssessment?.type === AssessmentType.SIMPLIFIED ||
								currentUserAssessment?.type === AssessmentType.FULL) && (
								<div className="flex justify-between items-center pt-4">
									<div className="flex space-x-2">
										<Link href="/education/assessment/form">
											<Button>
												<FileText className="w-4 h-4 mr-2" />
												Перейти к оценке
											</Button>
										</Link>
									</div>
								</div>
							)}
						</div>
					</CardContent>
				)}
			</Card>

			{/* Оценка подчиненных (если пользователь руководитель) */}
			{isSupervisor && subordinateUserAssessments?.length && (
				<>
					<Card>
						<CardHeader className="bg-gradient-to-r from-midGrey to-gray-600 text-white">
							<CardTitle className="flex justify-between">
								<div className={'flex items-center space-x-2'}>
									<Users className="w-6 h-6" />
									<span>Оценка подчиненных</span>
									<Badge
										variant="secondary"
										className="bg-white/20 text-white border-white/30"
									>
										{subordinateUserAssessments.length} сотрудников
									</Badge>
								</div>
								<Button
									variant={'secondary'}
									disabled={!subordinateAssessments}
									onClick={() => {
										!!subordinateAssessments &&
											exportGeneralAssessmentGroupedByDepartment(
												subordinateAssessments,
											);
									}}
								>
									Скачать таблицу
								</Button>
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							<div className="space-y-4">
								{subordinateUserAssessments?.map((subordinate) => {
									const assessment = subordinate?.assessment?.find(
										(a) => a.year === new Date().getFullYear(),
									);
									return (
										<div
											key={subordinate.id}
											className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-4">
													<Avatar className="h-8 w-8">
														<AvatarImage
															src={subordinate?.photo}
															alt="@shadcn"
														/>
														<AvatarFallback>
															{subordinate
																? `${subordinate?.name?.[0]?.toUpperCase()}${subordinate?.surname?.[0]?.toUpperCase()}`
																: ''}
														</AvatarFallback>
													</Avatar>
													<div>
														<div className="font-medium">
															{subordinate.name}
														</div>
														<div className="text-sm text-muted-foreground">
															{subordinate.position?.title}
														</div>
														<div className="text-xs text-muted-foreground">
															{subordinate.department?.title}
														</div>
													</div>
												</div>

												<div className="flex items-center space-x-4">
													<div className="flex flex-row space-x-1">
														{getAssessmentStatusBadge(assessment?.status)}
														{getAssessmentTypeBadge(assessment?.type)}
													</div>

													{!!assessment?.id && (
														<Link
															href={`/education/assessment/form/${assessment.id}`}
														>
															<Button variant="outline" size="sm">
																<Star className="w-4 h-4 mr-2 text-primary" />
																Оценить
															</Button>
														</Link>
													)}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
};
