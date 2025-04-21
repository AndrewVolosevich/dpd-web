'use client';

import { Button } from '@/components/ui/button';
import type { TrainingMaterial } from '@/types/education';
import {
	FileText,
	Video,
	Headphones,
	Monitor,
	File,
	Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/global/AuthProvider';

interface MaterialItemProps {
	material: TrainingMaterial;
	onDelete: (id: string) => void;
}

export const MaterialItem = ({ material, onDelete }: MaterialItemProps) => {
	const getFileExtension = (url: string) => {
		return url?.split('.')?.pop()?.toLowerCase() || '';
	};

	const getIcon = (materialUrl: string) => {
		// Извлечение расширения файла из URL
		const fileExtension = getFileExtension(materialUrl);

		switch (fileExtension) {
			case 'pdf':
			case 'doc':
			case 'docx':
			case 'txt':
				return <FileText className="h-5 w-5" />;
			case 'ppt':
			case 'pptx':
				return <Monitor className="h-5 w-5" />;
			case 'mp4':
			case 'avi':
			case 'mov':
				return <Video className="h-5 w-5" />;
			case 'mp3':
			case 'wav':
				return <Headphones className="h-5 w-5" />;
			default:
				return <File className="h-5 w-5" />;
		}
	};

	const { isAdmin } = useAuth();

	return (
		<div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
			<Link
				href={material.url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-3 flex-1"
			>
				<div className="text-gray-500">{getIcon(material.url)}</div>
				<div>
					<h4 className="font-medium text-gray-800">
						{material?.title}.{getFileExtension(material.url)}
					</h4>
				</div>
			</Link>
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
