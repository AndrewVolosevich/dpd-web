import React from 'react';
import { Question } from '@/types/entities';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { icons } from '@/const/icons';

const QuestionPreview = ({ question }: { question: Question }) => {
	if (!question.ratingConfig) return null;

	if (question.ratingConfig.type === 'EMOTIONS') {
		return (
			<div className="flex gap-4 items-center justify-center">
				{icons.map((Icon, index) => (
					<button key={index} className={`w-12 h-12 text-2xl}`} type="button">
						{Icon}
					</button>
				))}
			</div>
		);
	}
	if (question.ratingConfig.type === 'STARS') {
		return (
			<div className="flex gap-1 justify-center">
				{Array.from({ length: 5 }, (_, i) => (
					<Button key={i} variant="outline" size="lg" className="p-2">
						<Star className="h-6 w-6" />
					</Button>
				))}
			</div>
		);
	}
	if (question.ratingConfig.type === 'SCALE') {
		return (
			<div className="space-y-2">
				<div className="flex gap-2 flex-wrap justify-center">
					{Array.from(
						{ length: question.ratingConfig.maxValue || 10 },
						(_, i) => (
							<Button key={i} variant="outline" size="sm" className="w-10 h-10">
								{i + 1}
							</Button>
						),
					)}
				</div>
				{(question?.ratingConfig?.leftLabel ||
					question?.ratingConfig?.rightLabel) && (
					<div className="flex justify-between px-1 text-sm text-muted-foreground">
						<span>{question.ratingConfig.leftLabel}</span>
						<span>{question.ratingConfig.rightLabel}</span>
					</div>
				)}
			</div>
		);
	}
	return null;
};

export default QuestionPreview;
