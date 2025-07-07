'use client';

import { ReactElement } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { VeryDissatisfiedIcon } from '@/components/common/icons/VeryDissatisfiedIcon';
import { DissatisfiedIcon } from '@/components/common/icons/DissatisfiedIcon';
import { NeutralIcon } from '@/components/common/icons/NeutralIcon';
import { SatisfiedIcon } from '@/components/common/icons/SatisfiedIcon';
import { VerySatisfiedIcon } from '@/components/common/icons/VerySatisfiedIcon';
import useMoodStatistic from '@/lib/api/queries/Education/useMoodStatistic';
import { useMoodVote } from '@/lib/api/queries/Education/mutations/survey/useMoodVote';
import { useAuth } from '@/components/providers/global/AuthProvider';

type Emotion = {
	id: string;
	value: 1 | 2 | 3 | 4 | 5;
	name: string;
	component: ReactElement;
	color: string;
};

const emotions: Emotion[] = [
	{
		id: 'very-happy',
		value: 5,
		name: 'Отлично',
		component: <VerySatisfiedIcon key="5" />,
		color: 'bg-green-500',
	},
	{
		id: 'happy',
		value: 4,
		name: 'Хорошо',
		component: <SatisfiedIcon key="4" />,
		color: 'bg-blue-500',
	},
	{
		id: 'neutral',
		value: 3,
		name: 'Нормально',
		component: <NeutralIcon key="3" />,
		color: 'bg-yellow-500',
	},
	{
		id: 'sad',
		value: 2,
		name: 'Плохо',
		component: <DissatisfiedIcon key="2" />,
		color: 'bg-orange-500',
	},
	{
		id: 'very-sad',
		value: 1,
		name: 'Ужасно',
		component: <VeryDissatisfiedIcon key="1" />,
		color: 'bg-red-500',
	},
];

interface MoodSurveyModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function MoodSurveyModal({
	open,
	onOpenChange,
}: MoodSurveyModalProps) {
	const { data } = useMoodStatistic();
	const { mutate: moodVote } = useMoodVote();
	const { user } = useAuth();

	const handleVote = (value: number) => {
		if (data?.hasVoted) return;
		moodVote(value);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-center">
						{data?.hasVoted
							? 'Результаты опроса настроения'
							: 'Как ваше настроение сегодня?'}
					</DialogTitle>
				</DialogHeader>

				{!data?.hasVoted ? (
					<div className="space-y-4">
						<p className="text-center text-muted-foreground">
							Выберите эмоцию, которая лучше всего описывает ваше настроение
						</p>
						<div className="grid grid-cols-1 gap-3">
							{emotions.map((emotion) => (
								<Button
									key={emotion.id}
									variant="outline"
									className="h-auto p-4 hover:bg-accent bg-transparent flex flex-row justify-between"
									onClick={() => handleVote(emotion.value)}
								>
									<span className={`w-16 h-16`}>{emotion.component}</span>
									<span className="font-medium">{emotion.name}</span>
								</Button>
							))}
						</div>
					</div>
				) : (
					<div className="space-y-4">
						<div className="text-center">
							<p className="text-muted-foreground mb-2">Спасибо за участие!</p>
							<p className="text-sm text-muted-foreground">
								Всего проголосовало: {data?.totalVotes} человек
							</p>
						</div>

						<div className="space-y-3">
							{emotions.map((emotion) => {
								const votes = data?.votesPerOption?.[emotion.value] ?? 0;

								const percentage = data?.totalVotes
									? Math.round((votes / data.totalVotes) * 100)
									: 0;

								const isSelected = data.votedUsers.find(
									(item) =>
										item.userId === user?.id && item.option === emotion.value,
								);

								return (
									<Card
										key={emotion.id}
										className={isSelected ? 'ring-2 ring-primary' : ''}
									>
										<CardContent className="p-3">
											<div className="flex items-center justify-between mb-2">
												<div className="flex items-center gap-2">
													<span className={'w-12 h-12'}>
														{emotion.component}
													</span>
													<span className="font-medium text-sm">
														{emotion.name}
													</span>
													{isSelected && (
														<span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
															Ваш выбор
														</span>
													)}
												</div>
												<span className="text-sm font-medium">
													{percentage}%
												</span>
											</div>
											<Progress value={percentage} className="h-2" />
											<p className="text-xs text-muted-foreground mt-1">
												{votes}{' '}
												{votes === 1
													? 'голос'
													: votes < 5 && votes !== 0
														? 'голоса'
														: 'голосов'}
											</p>
										</CardContent>
									</Card>
								);
							})}
						</div>

						<div className="text-center">
							<Button onClick={() => onOpenChange(false)}>Закрыть</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
