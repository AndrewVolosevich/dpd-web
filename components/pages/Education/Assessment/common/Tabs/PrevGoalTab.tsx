import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Plus, Target, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { Assessment, AssessmentType, Goal } from '@/types/assessment';
import getGoalText from '@/components/pages/Education/Assessment/common/getGoalText';
import { PrevGoalModal } from '@/components/pages/Education/Assessment/common/Modals/PrevGoalModal';
import { formatMonthYearDate } from '@/lib/date/helpers';
import { DeleteGoalModal } from '@/components/pages/Education/Assessment/common/Modals/DeleteGoalModal';
import { useDeleteGoal } from '@/lib/api/queries/Assessment/mutations/useDeleteGoal';
import CommentsSection from '@/components/pages/News/CommentsSection';
import { getRatingBadge } from '@/components/pages/Education/Assessment/common/getRatingBadge';

const PrevGoalTab = ({ assessment }: { assessment: Assessment }) => {
	const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
	const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
	const [deletingGoalId, setDeletingGoalId] = useState<null | string>(null);

	const handleAddGoal = () => {
		setEditingGoal(null);
		setIsGoalModalOpen(true);
	};

	const handleEditGoal = (goal: Goal) => {
		setEditingGoal(goal);
		setIsGoalModalOpen(true);
	};

	const handleDeleteGoal = (id: string) => {
		setDeletingGoalId(id);
	};
	const { mutate: deleteGoal, isPending: deleteGoalLoading } = useDeleteGoal();

	if (!assessment || assessment.type !== AssessmentType.FULL) {
		return null;
	}

	return (
		<TabsContent value="prevGoals" className="space-y-4">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center space-x-2">
							<Target className="w-5 h-5" />
							<span>Оценочная форма</span>
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Evaluation Scores */}
					<div className="grid grid-cols-2 gap-4">
						<Card>
							<CardContent className="p-4 text-center">
								<div className="text-sm text-muted-foreground">
									Общий балл сотрудника
								</div>
								<div className="text-2xl font-bold text-gray-500">
									{assessment.averageLastYearUser}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4 text-center">
								<div className="text-sm text-muted-foreground">
									Общий балл руководителя
								</div>
								<div className="text-2xl font-bold text-red-500">
									{assessment?.averageLastYearSupervisor}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Evaluation Details */}
					<div className="space-y-3 text-xs border rounded-lg overflow-hidden">
						<div className="grid grid-cols-7 gap-2 font-medium border-b pb-2 bg-muted/50 py-2 px-1">
							<div
								className={'flex justify-center items-center text-center px-1'}
							>
								Описание цели/задачи по SMART:
							</div>
							<div
								className={'flex justify-center items-center text-center px-1'}
							>
								Результат выполнения цели/задачи
							</div>
							<div
								className={'flex justify-center items-center text-center px-1'}
							>
								Оценка сотрудника
							</div>
							<div
								className={'flex justify-center items-center text-center px-1'}
							>
								Оценка руководителя
							</div>
							<div
								className={'flex justify-center items-center text-center px-1'}
							>
								Планируемый срок исполнения
							</div>
							<div
								className={'flex justify-center items-center text-center px-1'}
							>
								Тип цели/задачи
							</div>
						</div>
						{assessment?.goalsLastYear?.map((goal) => (
							<div key={goal.id} className="grid grid-cols-7 gap-2">
								<div className={'flex justify-center items-center'}>
									{goal.title}
								</div>
								<div className={'flex justify-center items-center'}>
									{goal?.result}
								</div>
								{/*<div>{getGoalRatingText(goal?.employeeRating)}</div>*/}
								{/*<div>{getGoalRatingText(goal?.supervisorRating)}</div>*/}

								<div className={'flex justify-center items-center'}>
									{getRatingBadge('employee', goal?.employeeRating)}
								</div>
								<div className={'flex justify-center items-center'}>
									{getRatingBadge('supervisor', goal?.supervisorRating)}
								</div>

								<div className={'flex justify-center items-center'}>
									{formatMonthYearDate(goal?.dueDate)}
								</div>
								<div className={'flex justify-center items-center'}>
									{getGoalText(goal)}
								</div>
								<div className={'flex items-start justify-end space-x-2'}>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleEditGoal(goal)}
										className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
										tooltip={'Редактировать'}
									>
										<Edit className="w-4 h-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => {
											handleDeleteGoal(goal.id);
										}}
										className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
										tooltip={'Удалить'}
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<div className="flex justify-end space-x-2">
				<Button onClick={handleAddGoal}>
					<Plus className="w-4 h-4 mr-2" />
					Добавить цель
				</Button>
			</div>

			<div>
				<CommentsSection
					data={{
						id: assessment.id,
						comments: assessment?.commentsLastYear || [],
					}}
					dataType={'prevGoal'}
				/>
			</div>

			{isGoalModalOpen && (
				<PrevGoalModal
					isOpen={isGoalModalOpen}
					onClose={() => setIsGoalModalOpen(false)}
					goal={editingGoal}
					assessment={assessment}
				/>
			)}
			{deletingGoalId && (
				<DeleteGoalModal
					isOpen={!!deletingGoalId}
					onClose={() => {
						setDeletingGoalId(null);
					}}
					isLoading={deleteGoalLoading}
					onDelete={() => {
						deleteGoal(deletingGoalId, {
							onSettled: () => setDeletingGoalId(null),
						});
					}}
				/>
			)}
		</TabsContent>
	);
};

export default PrevGoalTab;
