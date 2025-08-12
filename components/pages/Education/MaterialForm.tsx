'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type React from 'react';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { Link, Upload } from 'lucide-react';

interface MaterialFormProps {
	onSubmit: (
		fileOrUrl: File | string,
		material: { title: string; isUrl: boolean },
	) => void;
	onCancel: () => void;
}

export const MaterialForm = ({ onSubmit, onCancel }: MaterialFormProps) => {
	const { isAdmin } = useAuth();
	const [title, setTitle] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [url, setUrl] = useState('');
	const [uploadType, setUploadType] = useState<'file' | 'url'>('file');
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (title.trim()) {
			if (uploadType === 'file' && file) {
				onSubmit(file, { title, isUrl: false });
				setTitle('');
				setFile(null);
			} else if (uploadType === 'url' && url.trim()) {
				onSubmit(url, { title, isUrl: true });
				setTitle('');
				setUrl('');
			}
		}
	};

	const isSubmitDisabled =
		!title.trim() ||
		(uploadType === 'file' && !file) ||
		(uploadType === 'url' && !url.trim());

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

			<div className="space-y-3">
				<Label>Тип загрузки</Label>
				<RadioGroup
					value={uploadType}
					onValueChange={(value) => setUploadType(value as 'file' | 'url')}
					className="flex space-x-4"
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="file" id="upload-file" />
						<Label
							htmlFor="upload-file"
							className="flex items-center cursor-pointer"
						>
							<Upload className="h-4 w-4 mr-2" />
							Загрузить файл
						</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="url" id="upload-url" />
						<Label
							htmlFor="upload-url"
							className="flex items-center cursor-pointer"
						>
							<Link className="h-4 w-4 mr-2" />
							Указать ссылку
						</Label>
					</div>
				</RadioGroup>
			</div>

			{uploadType === 'file' ? (
				<div>
					<Label htmlFor="material-file">Загрузить файл</Label>
					<Input
						id="material-file"
						type="file"
						onChange={handleFileChange}
						accept=".pdf"
						required={uploadType === 'file'}
					/>
					{file && (
						<p className="text-sm text-green-600 mt-1">
							Выбран файл: {file.name}
						</p>
					)}
				</div>
			) : (
				<div>
					<Label htmlFor="material-url">Ссылка на ресурс</Label>
					<Input
						id="material-url"
						type="url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="https://example.com/resource"
						required={uploadType === 'url'}
					/>
				</div>
			)}

			<div className="flex justify-end space-x-2">
				<Button type="button" variant="outline" onClick={onCancel}>
					Отмена
				</Button>
				<Button type="submit" disabled={isSubmitDisabled}>
					Добавить материал
				</Button>
			</div>
		</form>
	);
};
