'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TrainingSection } from '@/types/education';

interface SectionFormProps {
	onSubmit: (
		section: Omit<
			TrainingSection,
			'id' | 'materials' | 'createdAt' | 'updatedAt' | 'cabinetId'
		>,
	) => void;
	onCancel: () => void;
}

export const SectionForm = ({ onSubmit, onCancel }: SectionFormProps) => {
	const [title, setTitle] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (title.trim()) {
			onSubmit({ title });
			setTitle('');
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 p-4 border rounded-md bg-gray-50"
		>
			<div>
				<Label htmlFor="section-title">Название раздела</Label>
				<Input
					id="section-title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Введите название раздела"
					required
				/>
			</div>
			<div className="flex justify-end space-x-2">
				<Button type="button" variant="outline" onClick={onCancel}>
					Отмена
				</Button>
				<Button type="submit">Создать раздел</Button>
			</div>
		</form>
	);
};
