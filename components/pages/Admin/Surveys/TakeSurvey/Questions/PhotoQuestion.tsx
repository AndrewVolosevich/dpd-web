'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import type { Question } from '@/types/entities';

interface PhotoQuestionProps {
	question: Question;
	value: string | string[];
	onChange: (value: string | string[]) => void;
}

export function PhotoQuestion({
	question,
	value,
	onChange,
}: PhotoQuestionProps) {
	const photos = question.photos || [];
	const allowMultiple = question.allowMultipleSelection || false;
	if (photos.length === 0) {
		return (
			<div className="text-muted-foreground italic">
				В этом вопросе нет фотографий для выбора.
			</div>
		);
	}

	if (allowMultiple) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{photos.map((photo) => (
					<Card
						key={photo.url}
						className={`overflow-hidden cursor-pointer transition-all ${
							(value as string[])?.includes(photo.url)
								? 'ring-2 ring-primary'
								: ''
						}`}
						onClick={() => {
							if ((value as string[])?.includes(photo.url)) {
								onChange(
									(value as string[]).filter((url) => url !== photo.url),
								);
							} else {
								onChange([...((value as string[]) || []), photo.url]);
							}
						}}
					>
						<CardContent className="p-0 relative">
							<div className="relative aspect-square">
								<Image
									src={photo.url || '/placeholder.svg'}
									alt="Photo option"
									fill
									className="object-contain"
								/>
							</div>
							<div className="absolute top-2 left-2">
								<Checkbox
									checked={(value as string[])?.includes(photo.url)}
									onCheckedChange={(checked) => {
										if (checked) {
											onChange([...((value as string[]) || []), photo.url]);
										} else {
											onChange(
												(value as string[]).filter((url) => url !== photo.url),
											);
										}
									}}
									className="bg-white/90"
								/>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	return (
		<RadioGroup
			value={value as string}
			onValueChange={onChange}
			className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
		>
			{photos.map((photo) => (
				<div key={photo.url} className="relative">
					<Card
						className={`overflow-hidden cursor-pointer transition-all ${
							value === photo.url ? 'ring-2 ring-primary' : ''
						}`}
						onClick={() => onChange(photo?.url)}
					>
						<CardContent className="p-0 relative">
							<div className="relative aspect-square">
								<Image
									src={photo.url || '/placeholder.svg'}
									alt="Photo option"
									fill
									className="object-contain"
								/>
							</div>
							<div className="absolute top-2 left-2">
								<RadioGroupItem
									value={photo.url}
									id={photo.url}
									className="bg-white/90"
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			))}
		</RadioGroup>
	);
}
