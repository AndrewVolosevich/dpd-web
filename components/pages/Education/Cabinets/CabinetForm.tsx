'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TrainingCabinet } from '@/types/education';
import FileSelector from '@/components/common/FileSelector';

interface CabinetFormProps {
	onSubmit: (file: File | null, title: string) => void;
	onCancel: () => void;
	initialData?: Partial<TrainingCabinet>;
	isLoading: boolean;
}

export const CabinetForm = ({
	onSubmit,
	onCancel,
	initialData,
	isLoading,
}: CabinetFormProps) => {
	const [title, setTitle] = useState(initialData?.title || '');
	const [file, setFile] = useState<File | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(file, title);
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

			<div className="space-y-2 my-4">
				<Label>Изображение кабинета</Label>
				<FileSelector
					initialUrl={initialData?.imageUrl}
					useFile={[file, setFile]}
					isImage
				/>
			</div>

			<div className="flex justify-end space-x-2 mt-4">
				<Button type="button" variant="outline" onClick={onCancel}>
					Отмена
				</Button>
				<Button
					onClick={handleSubmit}
					type="button"
					disabled={isLoading || !(title || file)}
				>
					{isLoading ? 'Сохранение...' : 'Сохранить'}
				</Button>
			</div>
		</div>
	);
};
