'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TrainingSection } from '@/types/education';
import { MaterialItem } from './MaterialItem';
import { MaterialForm } from './MaterialForm';
import { Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/providers/global/AuthProvider';
import Loader from '@/components/common/Loader/Loader';

interface SectionCardProps {
	section: TrainingSection;
	onDeleteSection: (id: string) => void;
	onAddMaterial: (
		sectionId: string,
		file: File,
		material: any,
		section: TrainingSection,
	) => void; // Добавлен `file` в onAddMaterial
	onDeleteMaterial: (materialId: string) => void;
	materialLoading?: boolean;
}

export const SectionCard = ({
	section,
	onDeleteSection,
	onAddMaterial,
	onDeleteMaterial,
	materialLoading,
}: SectionCardProps) => {
	const [showForm, setShowForm] = useState(false);
	const { isAdmin } = useAuth();

	const materialBtn = useMemo(() => {
		if (!isAdmin) {
			return null;
		}
		if (materialLoading) {
			return (
				<div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-10">
					<Loader />
				</div>
			);
		} else {
			return (
				<Button
					variant="outline"
					className="w-full"
					onClick={() => setShowForm(true)}
				>
					<Plus className="h-4 w-4 mr-2" /> Добавить материал
				</Button>
			);
		}
	}, [materialLoading, isAdmin]);

	return (
		<Card>
			{section && (
				<>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>{section.title}</CardTitle>
						{isAdmin && (
							<Button
								variant="ghost"
								size="icon"
								onClick={() => onDeleteSection(section.id)}
								className="text-gray-500 hover:text-red-500"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						)}
					</CardHeader>
					<CardContent className="space-y-4">
						{section.materials?.length > 0 ? (
							<div className="space-y-2">
								{section.materials.map((material) => (
									<MaterialItem
										key={material.id}
										material={material}
										onDelete={(materialId) => onDeleteMaterial(materialId)}
									/>
								))}
							</div>
						) : (
							<p className="text-gray-500 text-center py-4">
								В этом разделе пока нет материалов
							</p>
						)}

						{showForm ? (
							<MaterialForm
								onSubmit={(file, material) => {
									onAddMaterial(section.id, file, material, section);
									setShowForm(false);
								}}
								onCancel={() => setShowForm(false)}
							/>
						) : (
							materialBtn
						)}
					</CardContent>
				</>
			)}
		</Card>
	);
};
