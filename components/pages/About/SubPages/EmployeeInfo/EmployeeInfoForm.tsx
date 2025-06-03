'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FileSelector from '@/components/common/FileSelector';
import { EmployeeInfoCard } from '@/types/content';
import { Textarea } from '@/components/ui/textarea';

interface EmployeeInfoFormProps {
	onSubmit: (file: File | null, data: Partial<EmployeeInfoCard>) => void;
	onCancel: () => void;
	initialData?: Partial<EmployeeInfoCard> | null;
	isLoading: boolean;
}

export const EmployeeInfoForm = ({
	onSubmit,
	onCancel,
	initialData,
	isLoading,
}: EmployeeInfoFormProps) => {
	const [name, setName] = useState(initialData?.name || '');
	const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || '');
	const [content, setContent] = useState(initialData?.content || '');
	const [file, setFile] = useState<File | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(file, { name, jobTitle, content });
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="name">Имя Фамилия</Label>
				<Input
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Введите имя и фамилию"
					required
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="jobTitle">Должность</Label>
				<Input
					id="jobTitle"
					value={jobTitle}
					onChange={(e) => setJobTitle(e.target.value)}
					placeholder="Введите должность"
					required
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="content">Информация</Label>
				<Textarea
					id="content"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="Введите информацию"
					required
					rows={10}
				/>
			</div>

			<div className="space-y-2 my-4">
				<Label>Изображение</Label>
				<FileSelector
					initialUrl={initialData?.imgUrl}
					useFile={[file, setFile]}
					isImage
					isAvatar
				/>
			</div>

			<div className="flex justify-end space-x-2 mt-4">
				<Button type="button" variant="outline" onClick={onCancel}>
					Отмена
				</Button>
				<Button
					onClick={handleSubmit}
					type="button"
					disabled={isLoading || !(name || file || jobTitle)}
				>
					{isLoading ? 'Сохранение...' : 'Сохранить'}
				</Button>
			</div>
		</div>
	);
};
