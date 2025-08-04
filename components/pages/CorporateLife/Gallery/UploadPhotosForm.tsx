'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type React from 'react';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { Loader2, Upload } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { useAddEventPhoto } from '@/lib/api/queries/Content/mutations/photo/useAddEventPhoto';

interface UploadPhotosFormProps {
	onCancel: () => void;
}

export const UploadPhotosForm = ({ onCancel }: UploadPhotosFormProps) => {
	const { isAdmin } = useAuth();
	const [title, setTitle] = useState('');
	const [files, setFiles] = useState<File[]>([]);

	const { mutate: addEventPhoto, isPending } = useAddEventPhoto();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const fileArray = Array.from(e.target.files);
			setFiles(fileArray);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (title.trim() && files.length > 0) {
			const formData = new FormData();

			files.forEach((file) => {
				formData.append('files', file, file.name);
			});
			formData.append('title', title);

			addEventPhoto(formData, {
				onSettled: () => {
					onCancel();
					setTitle('');
					setFiles([]);
				},
			});
		}
	};

	const isSubmitDisabled = !title.trim() || files.length === 0;

	if (!isAdmin) {
		return null;
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className={'space-y-4'}>
				<div>
					<Label htmlFor="photo-title">Название</Label>
					<Input
						id="photo-title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Введите название"
						required
					/>
				</div>

				<div>
					<Label htmlFor="photo-files">Загрузить фотографии</Label>
					<div className="flex items-center gap-2 mt-1">
						<Input
							id="photo-files"
							type="file"
							onChange={handleFileChange}
							accept="image/*"
							multiple
							required
							className="flex-1"
						/>
						<div className="flex items-center justify-center bg-gray-100 rounded-md p-2">
							<Upload className="h-5 w-5 text-gray-500" />
						</div>
					</div>
					{files.length > 0 && (
						<p className="text-sm text-green-600 mt-1">
							Выбрано файлов: {files.length} (
							{files.map((file) => file.name).join(', ')})
						</p>
					)}
				</div>
			</div>

			<DialogFooter className={'mt-8'}>
				<Button variant="outline" onClick={onCancel}>
					Отмена
				</Button>
				<Button
					type="submit"
					disabled={isPending || isSubmitDisabled}
					variant="default"
				>
					{isPending && <Loader2 className="animate-spin mr-2" />}
					Создать
				</Button>
			</DialogFooter>
		</form>
	);
};
