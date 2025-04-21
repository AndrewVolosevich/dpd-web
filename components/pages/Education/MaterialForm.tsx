'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type React from 'react';
import { useAuth } from '@/components/providers/global/AuthProvider';

interface MaterialFormProps {
	onSubmit: (file: File, material: { title: string }) => void;
	onCancel: () => void;
}

export const MaterialForm = ({ onSubmit, onCancel }: MaterialFormProps) => {
	const { isAdmin } = useAuth();
	const [title, setTitle] = useState('');
	const [file, setFile] = useState<File | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (title.trim() && file) {
			onSubmit(file, { title });
			setTitle('');
			setFile(null);
		}
	};

	if (!isAdmin) {
		return null;
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 p-4 border rounded-md bg-gray-50"
		>
			<div>
				<Label htmlFor="material-title">Название материала</Label>
				<Input
					id="material-title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Введите название материала"
					required
				/>
			</div>

			<div>
				<Label htmlFor="material-file">Загрузить файл</Label>
				<Input
					id="material-file"
					type="file"
					onChange={handleFileChange}
					accept="*/*"
					required
				/>
			</div>

			<div className="flex justify-end space-x-2">
				<Button type="button" variant="outline" onClick={onCancel}>
					Отмена
				</Button>
				<Button type="submit" disabled={!file}>
					Добавить материал
				</Button>
			</div>
		</form>
	);
};
