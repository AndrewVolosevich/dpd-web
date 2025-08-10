'use client';

import type React from 'react';
import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';
import { ThanksTo } from '@/types/content';
import { useUpdateThanksTo } from '@/lib/api/queries/Content/mutations/thanks-to/useUpdateThanksTo';

interface EditThanksModalProps {
	isOpen: boolean;
	onClose: () => void;
	thanks: ThanksTo;
}

export const EditThanksModal: React.FC<EditThanksModalProps> = ({
	isOpen,
	onClose,
	thanks,
}) => {
	const [formData, setFormData] = useState({
		title: thanks?.title || '',
		description: thanks?.description || '',
		from: thanks?.from || '',
		imageUrl: thanks?.imageUrl || '',
	});
	const [file, setFile] = useState<File | null>(null);
	const { mutate: updateThanksTo, isPending } = useUpdateThanksTo();
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: '' }));
		}
	};

	const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setFile(file);
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.title.trim()) {
			newErrors.title = 'Заголовок обязателен';
		}

		if (!formData.description.trim()) {
			newErrors.description = 'Описание обязательно';
		}

		if (!formData.from.trim()) {
			newErrors.from = 'Автор обязателен';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (validateForm()) {
			const form = new FormData();

			if (file) {
				form.append('file', file, file?.name);
			}
			form.append('title', formData?.title);
			form.append('description', formData?.description);
			form.append('from', formData?.from);
			form.append('imageUrl', formData?.imageUrl);
			form.append('id', thanks?.id);

			updateThanksTo(form, {
				onSuccess: () => {
					handleClose();
				},
			});
		}
	};

	const handleClose = () => {
		setErrors({});
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Редактировать благодарность</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div>
						<Label htmlFor="title">Заголовок *</Label>
						<Input
							id="title"
							value={formData.title}
							onChange={(e) => handleInputChange('title', e.target.value)}
							placeholder="Введите заголовок благодарности"
							className={errors.title ? 'border-red-500' : ''}
						/>
						{errors.title && (
							<p className="text-red-500 text-sm mt-1">{errors.title}</p>
						)}
					</div>

					<div>
						<Label htmlFor="from">Автор *</Label>
						<Input
							id="from"
							value={formData.from}
							onChange={(e) => handleInputChange('from', e.target.value)}
							placeholder="Введите имя автора"
							className={errors.from ? 'border-red-500' : ''}
						/>
						{errors.from && (
							<p className="text-red-500 text-sm mt-1">{errors.from}</p>
						)}
					</div>

					<div>
						<Label htmlFor="description">Описание *</Label>
						<Textarea
							id="description"
							value={formData.description}
							onChange={(e) => handleInputChange('description', e.target.value)}
							placeholder="Введите текст благодарности"
							rows={4}
							className={errors.description ? 'border-red-500' : ''}
						/>
						{errors.description && (
							<p className="text-red-500 text-sm mt-1">{errors.description}</p>
						)}
					</div>

					<div>
						<Label>Фотография</Label>
						<div className="space-y-4">
							<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
								<input
									type="file"
									accept="image/*"
									onChange={handlePhotoUpload}
									className="hidden"
									id="photo-upload-edit"
								/>
								<label
									htmlFor="photo-upload-edit"
									className="cursor-pointer flex flex-col items-center gap-2"
								>
									<Upload className="h-8 w-8 text-gray-400" />
									<span className="text-sm text-gray-600">
										{formData.imageUrl
											? 'Заменить фотографию'
											: 'Нажмите для загрузки фотографии'}
									</span>
									<span className="text-xs text-gray-400">
										Поддерживаются форматы: JPG, PNG, GIF
									</span>
								</label>
							</div>
							{(file || formData.imageUrl) && (
								<p className="text-sm text-green-600 mt-1">
									Выбран файл: {file?.name || formData.imageUrl}
								</p>
							)}
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleClose}>
						Отмена
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isPending || !validateForm()}
					>
						{isPending ? <Loader2 className="animate-spin mr-2" /> : null}
						Сохранить изменения
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
