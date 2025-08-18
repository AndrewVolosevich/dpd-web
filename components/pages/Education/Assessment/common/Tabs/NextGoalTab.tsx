import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Plus, Target, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import {
	Assessment,
	AssessmentStatus,
	AssessmentType,
	Goal,
} from '@/types/assessment';
import { formatMonthYearDate } from '@/lib/date/helpers';
import { DeleteGoalModal } from '@/components/pages/Education/Assessment/common/Modals/DeleteGoalModal';
import { useDeleteGoal } from '@/lib/api/queries/Assessment/mutations/useDeleteGoal';
import { NextGoalModal } from '@/components/pages/Education/Assessment/common/Modals/NextGoalModal';
import CommentsSection from '@/components/pages/News/CommentsSection';
import { useAuth } from '@/components/providers/global/AuthProvider';

const NextGoalTab = ({ assessment }: { assessment: Assessment }) => {
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

	const { user } = useAuth();
	const isSelfReady =
		(assessment?.status === AssessmentStatus.SELF_ASSESSMENT ||
			assessment?.status === AssessmentStatus.EMPLOYEE_ACKNOWLEDGEMENT) &&
		user?.id === assessment?.user?.id;

	const isSupervisorReady =
		assessment?.status === AssessmentStatus.SUPERVISOR_ASSESSMENT &&
		user?.id === assessment?.evaluator?.id;

	const isReadyForUpdate = isSelfReady || isSupervisorReady;

	if (!assessment || assessment.type !== AssessmentType.FULL) {
		return null;
	}

	return (
		<TabsContent value="nextGoals" className="space-y-4">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center space-x-2">
							<Target className="w-5 h-5" />
							<span>Оценочная форма</span>
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Evaluation Details */}
					<div className="space-y-3 text-sm border rounded-lg overflow-hidden">
						<div className="grid grid-cols-3 gap-2 font-medium border-b pb-2 bg-muted/50 py-2 px-1">
							<div>Описание цели/задачи по SMART:</div>
							<div>Планируемый срок исполнения</div>
						</div>
						{assessment?.goalsNextYear?.map((goal) => (
							<div key={goal.id} className="grid grid-cols-3 gap-2">
								<div className={'px-1'}>{goal.title}</div>
								<div className={'px-1'}>
									{formatMonthYearDate(goal?.dueDate)}
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
				<Button disabled={!isReadyForUpdate} onClick={handleAddGoal}>
					<Plus className="w-4 h-4 mr-2" />
					Добавить цель
				</Button>
			</div>

			<div>
				<CommentsSection
					data={{
						id: assessment.id,
						comments: assessment?.commentsNextYear || [],
					}}
					dataType={'nextGoal'}
				/>
			</div>

			{isGoalModalOpen && (
				<NextGoalModal
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

export default NextGoalTab;
