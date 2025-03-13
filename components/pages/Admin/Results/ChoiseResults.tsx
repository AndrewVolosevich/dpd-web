'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ChoiceResultsProps {
	question: {
		id: string;
		text: string;
		type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
		options: Array<{ value: string; correct?: boolean }>;
		answers: Array<{
			id: string;
			value: string | string[];
			comment?: string;
		}>;
	};
}

export function ChoiceResults({ question }: ChoiceResultsProps) {
	const results = useMemo(() => {
		const optionCounts: Record<string, number> = {};

		question.options.forEach((option) => {
			optionCounts[option.value] = 0;
		});

		question.answers.forEach((answer) => {
			if (
				question.type === 'SINGLE_CHOICE' &&
				typeof answer.value === 'string'
			) {
				optionCounts[answer.value] = (optionCounts[answer.value] || 0) + 1;
			} else if (
				question.type === 'MULTIPLE_CHOICE' &&
				Array.isArray(answer.value)
			) {
				answer.value.forEach((val) => {
					optionCounts[val] = (optionCounts[val] || 0) + 1;
				});
			}
		});

		const totalResponses =
			question.type === 'SINGLE_CHOICE'
				? question.answers.length
				: question.answers.reduce(
						(sum, answer) =>
							sum + (Array.isArray(answer.value) ? answer.value.length : 0),
						0,
					);

		return {
			counts: Object.entries(optionCounts).map(([option, count]) => ({
				option,
				count,
				percentage:
					totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0,
			})),
			totalResponses,
			totalAnswers: question.answers.length,
		};
	}, [question]);

	return (
		<div className="space-y-4">
			<div className="flex justify-between">
				<p className="text-sm text-muted-foreground">
					Всего ответов: {results.totalAnswers}
				</p>
				{question.type === 'MULTIPLE_CHOICE' && (
					<p className="text-sm text-muted-foreground">
						Всего выбрано вариантов: {results.totalResponses}
					</p>
				)}
			</div>

			<div className="space-y-4">
				{results.counts.map(({ option, count, percentage }) => (
					<div key={option} className="space-y-2">
						<div className="flex justify-between">
							<span>{option}</span>
							<span className="text-sm font-medium">
								{count} ({percentage}%)
							</span>
						</div>
						<Progress value={percentage} className="h-2" />
					</div>
				))}
			</div>

			{question.answers.some((a) => a.comment) && (
				<div className="mt-6">
					<h4 className="text-sm font-medium mb-2">Комментарии:</h4>
					<div className="space-y-2 max-h-60 overflow-y-auto">
						{question.answers
							.filter((a) => a.comment)
							.map((answer) => (
								<Card key={answer.id}>
									<CardContent className="p-3">
										<p className="text-sm">{answer.comment}</p>
									</CardContent>
								</Card>
							))}
					</div>
				</div>
			)}
		</div>
	);
}
