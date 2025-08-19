'use client';

import { Button } from '@/components/ui/button';
import type { TrainingMaterial } from '@/types/education';
import { Download, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { getFileExtension } from '@/lib/getIconForMaterial';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import React from 'react';

interface MaterialItemProps {
	material: TrainingMaterial;
	onDelete: (id: string) => void;
}

export const MaterialItem = ({ material, onDelete }: MaterialItemProps) => {
	const { isAdmin } = useAuth();
	const url = material?.fileUrl || material?.url || '';

	const handleDownload = () => {
		// Используем fetch для загрузки бинарного содержимого
		if (material?.url) {
			fetch(material?.url)
				.then((response) => {
					if (!response.ok) {
						throw new Error('Ошибка загрузки файла');
					}
					return response.blob();
				})
				.then((blob) => {
					// Генерируем URL для содержимого файла
					const blobUrl = window.URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = blobUrl;
					link.download = `${material.title}.pdf`;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					// Удаляем временный blob URL
					window.URL.revokeObjectURL(blobUrl);
				})
				.catch((err) => {
					console.error('Ошибка загрузки файла:', err.message);
				});
		}
	};

	return (
		<div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
			<div className="flex flex-col gap-2">
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline" size="sm">
							<Eye className="h-4 w-4 mr-2" />
							<h4 className="font-medium text-gray-800">
								Просмотр {material?.title}.{getFileExtension(material?.url)}
							</h4>
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-[90vw] h-[90vh]">
						<DialogHeader>
							<DialogTitle>{material?.title}</DialogTitle>
						</DialogHeader>
						<div className="flex-1 w-full h-[calc(90vh-6rem)]">
							<iframe
								src={url}
								className="w-full h-full rounded-md"
								title={`${material?.title}`}
							/>
						</div>
					</DialogContent>
				</Dialog>
				{material?.url && (
					<Button
						variant="outline"
						size="sm"
						onClick={handleDownload}
						className={'text-gray-800'}
					>
						<Download className="h-4 w-4 mr-2" />
						Скачать {material?.title}.{getFileExtension(material.url)}
					</Button>
				)}
			</div>

			{isAdmin && (
				<Button
					variant="ghost"
					size="icon"
					onClick={(e) => {
						e.preventDefault();
						onDelete(material.id);
					}}
					className="text-gray-500 hover:text-red-500"
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
};
