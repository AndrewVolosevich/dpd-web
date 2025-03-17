'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

interface PhotoResultsProps {
	question: {
		id: string;
		text: string;
		photos?: { url: string }[];
		allowMultipleSelection?: boolean;
		answers: Array<{
			id: string;
			value: string | string[];
			comment?: string;
		}>;
	};
}

export function PhotoResults({ question }: PhotoResultsProps) {
	const results = useMemo(() => {
		const photoCounts: Record<string, number> = {};
		const photos = question.photos || [];

		// Initialize counts for all photos
		photos.forEach((photo) => {
			photoCounts[photo.url] = 0;
		});

		// Count votes for each photo
		question.answers.forEach((answer) => {
			if (question.allowMultipleSelection && Array.isArray(answer.value)) {
				answer.value.forEach((photoId) => {
					photoCounts[photoId] = (photoCounts[photoId] || 0) + 1;
				});
			} else if (typeof answer.value === 'string') {
				photoCounts[answer.value] = (photoCounts[answer.value] || 0) + 1;
			}
		});

		// Calculate total votes
		const totalVotes = question.allowMultipleSelection
			? Object.values(photoCounts).reduce((sum, count) => sum + count, 0)
			: question.answers.length;

		// Map to array with percentages
		const photoResults = photos
			.map((photo) => {
				const count = photoCounts[photo.url] || 0;
				const percentage =
					totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

				return {
					photo,
					count,
					percentage,
				};
			})
			.sort((a, b) => b.count - a.count); // Sort by votes, highest first

		return {
			photoResults,
			totalResponses: question.answers.length,
			totalVotes,
		};
	}, [question]);

	return (
		<div className="space-y-4">
			<div className="flex justify-between">
				<p className="text-sm text-muted-foreground">
					Всего ответов: {results.totalResponses}
				</p>
				{question.allowMultipleSelection && (
					<p className="text-sm text-muted-foreground">
						Всего голосов: {results.totalVotes}
					</p>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{results.photoResults.map(({ photo, count, percentage }) => (
					<Card key={photo.url} className="overflow-hidden">
						<div className="relative aspect-square">
							<Image
								src={photo.url || '/placeholder.svg'}
								alt="Photo result"
								fill
								className="object-contain"
							/>
							<div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
								<div className="flex justify-between mb-1">
									<span>
										{count} голос{count === 1 ? '' : count < 5 ? 'а' : 'ов'}
									</span>
									<span>{percentage}%</span>
								</div>
								<Progress value={percentage} className="h-2 bg-white/30" />
							</div>
						</div>
					</Card>
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
