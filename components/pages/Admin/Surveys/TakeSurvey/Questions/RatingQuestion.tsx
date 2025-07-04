import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Question } from '@/types/entities';
import { icons } from '@/const/icons';

interface RatingQuestionProps {
	question: Question;
	value: number | null;
	onChange: (value: number) => void;
}

export function RatingQuestion({
	question,
	value,
	onChange,
}: RatingQuestionProps) {
	const renderRating = () => {
		switch (question?.ratingConfig?.type) {
			case 'EMOTIONS':
				return (
					<div className="flex gap-4 items-center justify-center">
						{icons.map((Icon, index) => (
							<button
								key={index}
								className={`w-24 h-24 text-2xl hover:scale-110 transition-transform ${value === index + 1 ? 'scale-125' : ''}`}
								onClick={() => onChange(index + 1)}
								type="button"
							>
								{Icon}
							</button>
						))}
					</div>
				);
			case 'STARS':
				return (
					<div className="flex gap-1">
						{Array.from({ length: 5 }, (_, i) => (
							<Button
								key={i}
								variant="outline"
								size="lg"
								className="p-2"
								onClick={() => onChange(i + 1)}
							>
								<Star
									className={`h-6 w-6 ${(value || 0) > i ? 'fill-yellow-400' : ''}`}
								/>
							</Button>
						))}
					</div>
				);
			case 'SCALE':
				return (
					<div className={'flex flex-col'}>
						<div className="flex gap-2 flex-wrap justify-center">
							{Array.from(
								{ length: question.ratingConfig.maxValue || 10 },
								(_, i) => (
									<Button
										key={i}
										variant="outline"
										size="sm"
										className={`w-10 h-10 ${value === i + 1 ? 'bg-primary text-primary-foreground' : ''}`}
										onClick={() => onChange(i + 1)}
									>
										{i + 1}
									</Button>
								),
							)}
						</div>
						<div
							className={
								'flex justify-between px-1 text-sm text-muted-foreground'
							}
						>
							<span>{question.ratingConfig?.leftLabel}</span>
							<span>{question.ratingConfig?.rightLabel}</span>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return <div className="py-4">{renderRating()}</div>;
}
