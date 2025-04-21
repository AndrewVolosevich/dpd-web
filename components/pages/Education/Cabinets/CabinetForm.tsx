'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TrainingCabinet } from '@/types/education';
import UploadImage from '@/components/common/UploadImage';

interface CabinetFormProps {
	onSubmit: (cabinet: Omit<TrainingCabinet, 'id' | 'sections'>) => void;
	onCancel: () => void;
	initialData?: Partial<TrainingCabinet>;
}

export const CabinetForm = ({
	onSubmit,
	onCancel,
	initialData,
}: CabinetFormProps) => {
	const [title, setTitle] = useState(initialData?.title || '');
	const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		onSubmit({
			title,
			imageUrl,
		});

		setIsSubmitting(false);
	};

	const handleImageUploaded = (val?: string) => {
		val && setImageUrl(val);
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="title">Название кабинета</Label>
				<Input
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Введите название кабинета"
					required
				/>
			</div>

			<div className="space-y-2">
				<Label>Изображение кабинета</Label>
				<UploadImage
					onClose={handleImageUploaded}
					url={'/upload/update-cabinet-image'}
					hideImage={!!imageUrl}
				/>
			</div>

			<div className="flex justify-end space-x-2 mt-4">
				<Button type="button" variant="outline" onClick={onCancel}>
					Отмена
				</Button>
				<Button
					onClick={handleSubmit}
					type="button"
					disabled={isSubmitting || !title || !imageUrl}
				>
					{isSubmitting ? 'Сохранение...' : 'Сохранить'}
				</Button>
			</div>
		</div>
	);
};
