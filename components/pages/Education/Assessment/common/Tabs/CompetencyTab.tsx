import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { Star } from 'lucide-react';
import {
	Assessment,
	AssessmentStatus,
	CompetencyWithRatings,
} from '@/types/assessment';
import { defaultCompetency } from '@/const/assessment';
import { CompetencyModal } from '@/components/pages/Education/Assessment/common/Modals/CompetencyModal';
import { mergeAndSortCompetencies } from '@/components/pages/Education/Assessment/common/getCompetencyRating';
import CommentsSection from '@/components/pages/News/CommentsSection';
import { getRatingBadge } from '@/components/pages/Education/Assessment/common/getRatingBadge';
import { useAuth } from '@/components/providers/global/AuthProvider';

const CompetencyTab = ({ assessment }: { assessment?: Assessment }) => {
	const competencies = assessment?.competencies;
	const competenciesWithRatings = useMemo(() => {
		return mergeAndSortCompetencies(defaultCompetency, competencies || []);
	}, [competencies]);

	const [isCompetencyModalOpen, setIsCompetencyModalOpen] = useState(false);
	const [selectedCompetency, setSelectedCompetency] =
		useState<CompetencyWithRatings | null>(null);

	const handleViewCompetency = (competency: CompetencyWithRatings) => {
		setSelectedCompetency(competency);
		setIsCompetencyModalOpen(true);
	};

	const isForSupervisor = assessment?.user?.roles?.some(
		(r) => r === 'SUPERVISOR',
	);

	const { user } = useAuth();
	const isSelfReady =
		(assessment?.status === AssessmentStatus.SELF_ASSESSMENT ||
			assessment?.status === AssessmentStatus.EMPLOYEE_ACKNOWLEDGEMENT) &&
		user?.id === assessment?.user?.id;

	const isSupervisorReady =
		assessment?.status === AssessmentStatus.SUPERVISOR_ASSESSMENT &&
		user?.id === assessment?.evaluator?.id;

	const isReadyForUpdate = isSelfReady || isSupervisorReady;

	return (
		<TabsContent value="competencies" className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Оценка компетенций</CardTitle>
				</CardHeader>
				<CardContent>
					{/* Evaluation Scores */}
					<div className="grid grid-cols-2 gap-4 mb-4">
						<Card>
							<CardContent className="p-4 text-center">
								<div className="text-sm text-muted-foreground">
									Общий балл сотрудника
								</div>
								<div className="text-2xl font-bold text-gray-500">
									{assessment?.averageCompetencyUser}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4 text-center">
								<div className="text-sm text-muted-foreground">
									Общий балл руководителя
								</div>
								<div className="text-2xl font-bold text-red-500">
									{assessment?.averageCompetencySupervisor}
								</div>
							</CardContent>
						</Card>
					</div>
					<div className="border rounded-lg overflow-hidden">
						<div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 font-medium text-sm">
							<div>Компетенция</div>
							<div className="text-center">Оценка сотрудника</div>
							<div className="text-center">Оценка руководителя</div>
							<div className="text-center">Действия</div>
						</div>

						{competenciesWithRatings.map((competency) => {
							if (
								!isForSupervisor &&
								competency?.title === 'Управление персоналом'
							) {
								return null;
							}

							return (
								<div
									key={competency.title}
									className={`grid grid-cols-4 gap-4 p-4 items-center hover:bg-muted/25`}
								>
									<div>
										<div className="font-medium">{competency.title}</div>
									</div>
									<div className="text-center">
										{getRatingBadge('employee', competency?.employeeRating)}
									</div>
									<div className="text-center">
										{getRatingBadge('supervisor', competency?.supervisorRating)}
									</div>
									<div className="text-center">
										{isReadyForUpdate && (
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleViewCompetency(competency)}
											>
												<Star className="w-4 h-4 mr-2 text-primary" />
												Оценить
											</Button>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{assessment && (
				<div>
					<CommentsSection
						data={{
							id: assessment.id,
							comments: assessment?.commentsCompetencies || [],
						}}
						dataType={'competency'}
					/>
				</div>
			)}

			{isCompetencyModalOpen && selectedCompetency && (
				<CompetencyModal
					isOpen={isCompetencyModalOpen}
					competency={selectedCompetency}
					assessment={assessment}
					onClose={() => setIsCompetencyModalOpen(false)}
				/>
			)}
		</TabsContent>
	);
};

export default CompetencyTab;
