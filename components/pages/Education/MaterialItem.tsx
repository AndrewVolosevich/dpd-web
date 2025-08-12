'use client';

import { Button } from '@/components/ui/button';
import type { TrainingMaterial } from '@/types/education';
import { Eye, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { getFileExtension } from '@/lib/getIconForMaterial';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

interface MaterialItemProps {
	material: TrainingMaterial;
	onDelete: (id: string) => void;
}

export const MaterialItem = ({ material, onDelete }: MaterialItemProps) => {
	const { isAdmin } = useAuth();
	const url = material?.fileUrl || material?.url || '';
	return (
		<div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
			<div className="flex gap-2">
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline" size="sm">
							<Eye className="h-4 w-4 mr-2" />
							<h4 className="font-medium text-gray-800">
								{material?.title}.{getFileExtension(material.url)}
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
