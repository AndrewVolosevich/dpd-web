'use client';

import { Button } from '@/components/ui/button';
import type { TrainingMaterial } from '@/types/education';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { getFileExtension, getIconForMaterial } from '@/lib/getIconForMaterial';

interface MaterialItemProps {
	material: TrainingMaterial;
	onDelete: (id: string) => void;
}

export const MaterialItem = ({ material, onDelete }: MaterialItemProps) => {
	const { isAdmin } = useAuth();
	const url = material?.fileUrl || material?.url || '';
	return (
		<div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
			<Link
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-3 flex-1"
			>
				<div className="text-gray-500">
					{getIconForMaterial(material?.url, !!material?.fileUrl)}
				</div>
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
