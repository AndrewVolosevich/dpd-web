'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { TrainingSection } from '@/types/education';
import { SectionCard } from '../SectionCard';
import { SectionForm } from '../SectionForm';
import { Plus } from 'lucide-react';
import useCabinet from '@/lib/api/queries/Education/useCabinet';
import { useAuth } from '@/components/providers/global/AuthProvider';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { Routes } from '@/const/routes';
import { useCreateSection } from '@/lib/api/queries/Education/mutations/cabinet/useCreateSection';
import { useDeleteSection } from '@/lib/api/queries/Education/mutations/cabinet/useDeleteSection';
import { useAddMaterial } from '@/lib/api/queries/Education/mutations/material/useAddMaterial';
import { useDeleteMaterial } from '@/lib/api/queries/Education/mutations/material/useDeleteMaterial';

interface CabinetPageProps {
	cabinetId: string;
}

export const CabinetPage = ({ cabinetId }: CabinetPageProps) => {
	const [showForm, setShowForm] = useState(false);
	const { isAdmin } = useAuth();
	const { data: cabinet } = useCabinet(cabinetId);
	const { mutateAsync: createSection } = useCreateSection();
	const { mutateAsync: deleteSection } = useDeleteSection();
	const { mutateAsync: addMaterial, isPending: materialLoading } =
		useAddMaterial();
	const { mutateAsync: deleteMaterial } = useDeleteMaterial();

	const handleAddSection = async (
		sectionData: Omit<
			TrainingSection,
			'id' | 'materials' | 'createdAt' | 'updatedAt' | 'cabinetId'
		>,
	) => {
		const newSection: Omit<
			TrainingSection,
			'id' | 'materials' | 'createdAt' | 'updatedAt'
		> = {
			title: sectionData.title,
			cabinetId,
		};
		await createSection(newSection);
		setShowForm(false);
	};

	const handleDeleteSection = async (sectionId: string) => {
		await deleteSection(sectionId);
	};

	const handleAddMaterial = async (
		sectionId: string, // ID раздела, к которому добавляется материал
		file: File | string, // Загружаемый файл
		materialData: { title: string; isUrl: boolean },
		section: TrainingSection,
	) => {
		if (!cabinet) {
			return;
		}
		// Создаем FormData для передачи файла вместе с данными
		const formData = new FormData();

		// Добавляем файл, данные материала, а также информацию о разделах
		formData.append('file', file); // Файл: key должен совпадать с FileInterceptor
		formData.append('title', materialData?.title);
		formData.append('sectionId', sectionId);
		formData.append('cabinetTitle', cabinet?.title);
		formData.append('sectionTitle', section?.title);
		formData.append('fileUrl', materialData?.isUrl ? file : '');

		await addMaterial(formData);
	};

	const handleDeleteMaterial = async (materialId: string) => {
		await deleteMaterial(materialId);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<Breadcrumb>
				<BreadcrumbList className="p-0 list-none">
					<BreadcrumbItem>
						<BreadcrumbLink href={`${Routes.EDUCATION}/materials`}>
							Все материалы /
						</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			{cabinet && (
				<>
					<h1 className="text-2xl font-bold mb-2">{cabinet.title}</h1>

					{cabinet?.sections && (
						<>
							<div className="space-y-6">
								{cabinet.sections.map((section) => (
									<SectionCard
										key={section.id}
										section={section}
										onDeleteSection={handleDeleteSection}
										onAddMaterial={handleAddMaterial}
										onDeleteMaterial={handleDeleteMaterial}
										materialLoading={materialLoading}
									/>
								))}

								{isAdmin && (
									<>
										{showForm ? (
											<SectionForm
												onSubmit={handleAddSection}
												onCancel={() => setShowForm(false)}
											/>
										) : (
											<>
												<Button
													variant="outline"
													className="w-full"
													onClick={() => setShowForm(true)}
												>
													<Plus className="h-4 w-4 mr-2" /> Добавить раздел
												</Button>
											</>
										)}
									</>
								)}
							</div>
						</>
					)}
				</>
			)}
		</div>
	);
};
