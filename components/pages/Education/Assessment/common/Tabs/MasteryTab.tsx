import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { Star } from 'lucide-react';
import { Assessment, CompetencyWithRatings } from '@/types/assessment';
import { mergeAndSortMastery } from '@/components/pages/Education/Assessment/common/getCompetencyRating';
import CommentsSection from '@/components/pages/News/CommentsSection';
import { getRatingBadge } from '@/components/pages/Education/Assessment/common/getRatingBadge';
import { MasteryModal } from '@/components/pages/Education/Assessment/common/Modals/MasteryModal';
import { defaultMasteryData } from '@/const/assessment';
import { getMasteryLevelRating } from '@/components/pages/Education/Assessment/common/getMasteryLevelText';

const MasteryTab = ({ assessment }: { assessment?: Assessment }) => {
	const mastery = assessment?.mastery;
	const masteryWithRatings = useMemo(() => {
		return mergeAndSortMastery(defaultMasteryData, mastery || []);
	}, [mastery]);

	const [isMasteryModalOpen, setIsMasteryModalOpen] = useState(false);
	const [selectedMastery, setSelectedMastery] =
		useState<CompetencyWithRatings | null>(null);

	const handleViewMastery = (mastery: CompetencyWithRatings) => {
		setSelectedMastery(mastery);
		setIsMasteryModalOpen(true);
	};

	const userMasteryResult = getMasteryLevelRating(
		assessment?.averageMasteryUser,
	);
	const supervisorMasteryResult = getMasteryLevelRating(
		assessment?.averageMasteryUser,
	);

	return (
		<TabsContent value="mastery" className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Оценка проф. мастерства</CardTitle>
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
									{assessment?.averageMasteryUser || '0'}/12
								</div>
								<div className="text-xl text-gray-500">
									{userMasteryResult?.title}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4 text-center">
								<div className="text-sm text-muted-foreground">
									Общий балл руководителя
								</div>
								<div className="text-2xl font-bold text-red-500">
									{assessment?.averageMasterySupervisor || '0'}/12
								</div>
								<div className="text-xl text-red-500">
									{supervisorMasteryResult?.title}
								</div>
							</CardContent>
						</Card>
					</div>
					<div className="border rounded-lg overflow-hidden">
						<div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 font-medium text-sm">
							<div>Уровень</div>
							<div className="text-center">Оценка сотрудника</div>
							<div className="text-center">Оценка руководителя</div>
							<div className="text-center">Действия</div>
						</div>

						{masteryWithRatings.map((mastery) => {
							return (
								<div
									key={mastery.title}
									className={`grid grid-cols-4 gap-4 p-4 items-center hover:bg-muted/25`}
								>
									<div>
										<div className="font-medium">{mastery.title}</div>
									</div>
									<div className="text-center">
										{getRatingBadge('employee', mastery?.employeeRating)}
									</div>
									<div className="text-center">
										{getRatingBadge('supervisor', mastery?.supervisorRating)}
									</div>
									<div className="text-center">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleViewMastery(mastery)}
										>
											<Star className="w-4 h-4 mr-2 text-primary" />
											Оценить
										</Button>
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
							comments: assessment?.commentsMastery || [],
						}}
						dataType={'mastery'}
					/>
				</div>
			)}

			{isMasteryModalOpen && selectedMastery && (
				<MasteryModal
					isOpen={isMasteryModalOpen}
					mastery={selectedMastery}
					assessment={assessment}
					onClose={() => setIsMasteryModalOpen(false)}
				/>
			)}
		</TabsContent>
	);
};

export default MasteryTab;
