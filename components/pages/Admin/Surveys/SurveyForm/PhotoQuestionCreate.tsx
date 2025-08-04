'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { useUploadPhotoQuestion } from '@/lib/api/queries/Education/mutations/survey/useUploadPhotoQuestion';
import { useDeletePhotoQuestion } from '@/lib/api/queries/Education/mutations/survey/useDeletePhotoQuestion';

interface PhotoQuestionProps {
	question: {
		photos?: { url: string }[];
		allowMultipleSelection?: boolean;
	};
	onChange: (updates: {
		photos?: { url: string }[];
		allowMultipleSelection?: boolean;
	}) => void;
}

export function PhotoQuestionCreate({
	question,
	onChange,
}: PhotoQuestionProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);

	const { mutate: uploadPhoto } = useUploadPhotoQuestion();
	const { mutate: deletePhoto } = useDeletePhotoQuestion();

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (file) {
			setUploading(true);
			const formData = new FormData();
			formData.append('file', file, file.name);
			uploadPhoto(formData, {
				onSuccess: (data) => {
					if (data?.url) {
						const newPhoto = { url: data.url as string };
						onChange({
							photos: [...(question.photos || []), newPhoto],
						});
					}
					if (fileInputRef.current) {
						fileInputRef.current.value = '';
					}
					setUploading(false);
				},
				onError: () => {
					setUploading(false);
				},
			});
		}
	};

	const removePhoto = (url: string) => {
		deletePhoto(url);
		onChange({
			photos: question.photos?.filter((photo) => photo.url !== url) || [],
		});
	};

	const toggleMultipleSelection = (checked: boolean) => {
		onChange({ allowMultipleSelection: checked });
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center space-x-2">
				<Switch
					id="allow-multiple"
					checked={question.allowMultipleSelection || false}
					onCheckedChange={toggleMultipleSelection}
				/>
				<Label htmlFor="allow-multiple">
					Разрешить выбрать несколько фотографий
				</Label>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Label>Фотографии</Label>
					<div>
						<input
							type="file"
							id="photo-upload"
							className="hidden"
							accept="image/*"
							onChange={handleFileChange}
							ref={fileInputRef}
						/>
						<Button
							variant="outline"
							size="sm"
							onClick={() => fileInputRef.current?.click()}
							disabled={uploading}
						>
							{uploading ? (
								<>Загрузка...</>
							) : (
								<>
									<Upload className="h-4 w-4 mr-2" />
									Загрузить фото
								</>
							)}
						</Button>
					</div>
				</div>

				{question.photos && question.photos.length > 0 ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
						{question.photos.map((photo, idx) => (
							<Card key={idx} className="overflow-hidden relative group">
								<div className="relative aspect-square">
									<Image
										src={photo.url || '/placeholder.svg'}
										alt="Photo option"
										fill
										className="object-contain"
									/>
								</div>
								<Button
									variant="destructive"
									size="sm"
									className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
									onClick={() => removePhoto(photo.url)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</Card>
						))}
					</div>
				) : (
					<div className="border rounded-lg p-8 text-center">
						<div className="flex justify-center mb-4">
							<PlusCircle className="h-12 w-12 text-muted-foreground" />
						</div>
						<p className="text-muted-foreground">
							Добавьте фотографии для голосования
						</p>
					</div>
				)}
			</div>

			<div className="border rounded-lg p-4 bg-muted/50">
				<Label className="block mb-4">Предпросмотр:</Label>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
					{question.photos?.map((photo, index) => (
						<Card key={index} className="overflow-hidden relative">
							<CardContent className="p-0">
								<div className="relative aspect-square">
									<Image
										src={photo.url || '/placeholder.svg'}
										alt={`Вариант ${index + 1}`}
										fill
										className="object-contain"
									/>
								</div>
								<div className="absolute top-2 left-2 bg-background/80 rounded-full w-6 h-6 flex items-center justify-center">
									{question.allowMultipleSelection ? (
										<div className="w-3 h-3 border border-foreground rounded" />
									) : (
										<div className="w-3 h-3 border border-foreground rounded-full" />
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
