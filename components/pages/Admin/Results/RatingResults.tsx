'use client';

import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';

interface RatingResultsProps {
	question: {
		id: string;
		text: string;
		ratingConfig?: {
			type: string;
			maxValue?: number;
			leftLabel?: string;
			rightLabel?: string;
		};
		answers: Array<{
			id: string;
			value: number;
			comment?: string;
		}>;
	};
}
export function RatingResults({ question }: RatingResultsProps) {
	const maxValue = useMemo(() => {
		if (
			question?.ratingConfig?.type === 'EMOTIONS' ||
			question?.ratingConfig?.type === 'STARS'
		) {
			return 5;
		}
		return question.ratingConfig?.maxValue || 10;
	}, [question.ratingConfig]);

	const results = useMemo(() => {
		const ratings: Record<number, number> = {};

		// Инициализация счетчиков для всех возможных оценок
		for (let i = 1; i <= maxValue; i++) {
			ratings[i] = 0;
		}

		// Подсчет ответов
		question.answers.forEach((answer) => {
			if (typeof answer.value === 'number') {
				ratings[answer.value] = (ratings[answer.value] || 0) + 1;
			}
		});

		// Расчет среднего значения
		const totalRating = question.answers.reduce(
			(sum, answer) =>
				sum + (typeof answer.value === 'number' ? answer.value : 0),
			0,
		);
		const averageRating =
			question.answers.length > 0
				? (totalRating / question.answers.length).toFixed(1)
				: '0.0';

		// Преобразование в массив для отображения
		const ratingCounts = Object.entries(ratings).map(([rating, count]) => ({
			rating: Number(rating),
			count,
			percentage:
				question.answers.length > 0
					? Math.round((count / question.answers.length) * 100)
					: 0,
		}));

		return {
			ratingCounts,
			averageRating,
			totalAnswers: question.answers.length,
		};
	}, [question, maxValue]);

	const renderRatingType = () => {
		switch (question.ratingConfig?.type) {
			case 'EMOTIONS':
				return (
					<div className="flex justify-center items-center text-4xl mb-4">
						{['😡', '🙁', '😐', '🙂', '😊'].map((emoji, index) => (
							<span
								key={index}
								className={`mx-2 ${Number(results.averageRating) >= index + 1 ? 'opacity-100' : 'opacity-30'}`}
							>
								{emoji}
							</span>
						))}
					</div>
				);
			case 'STARS':
				return (
					<div className="flex justify-center items-center text-2xl text-yellow-400 mb-4">
						{Array.from({ length: 5 }).map((_, index) => (
							<span
								key={index}
								className={
									Number(results.averageRating) >= index + 1
										? 'opacity-100'
										: 'opacity-30'
								}
							>
								★
							</span>
						))}
					</div>
				);
			case 'SCALE':
			default:
				return (
					<div className="text-center mb-4">
						<span className="text-4xl font-bold">{results.averageRating}</span>
						<span className="text-lg text-muted-foreground ml-2">
							/ {question.ratingConfig?.maxValue || 10}
						</span>
					</div>
				);
		}
	};

	return (
		<div className="space-y-4">
			<p className="text-sm text-muted-foreground text-center">
				Всего ответов: {results.totalAnswers}
			</p>

			{renderRatingType()}

			<div className="space-y-3">
				{results.ratingCounts.map(({ rating, count, percentage }) => (
					<div key={rating} className="space-y-1">
						<div className="flex justify-between">
							<span>{rating}</span>
							<span className="text-sm font-medium">
								{count} ({percentage}%)
							</span>
						</div>
						<Progress value={percentage} className="h-2" />
					</div>
				))}
			</div>

			{question.ratingConfig?.type === 'SCALE' && (
				<div className="flex justify-between text-sm text-muted-foreground mt-2">
					<span>{question.ratingConfig.leftLabel}</span>
					<span>{question.ratingConfig.rightLabel}</span>
				</div>
			)}
		</div>
	);
}
