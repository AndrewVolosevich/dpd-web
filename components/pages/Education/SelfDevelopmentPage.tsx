'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { type TrainingSection } from '@/types/education';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { Loader2, Plus, PlusCircle } from 'lucide-react';
import { useCreateCabinet } from '@/lib/api/queries/Education/mutations/cabinet/useCreateCabinet';
import useEducationCabinetByTitle from '@/lib/api/queries/Education/useEducationCabinetByTitle';
import { useCreateSection } from '@/lib/api/queries/Education/mutations/cabinet/useCreateSection';
import { useDeleteSection } from '@/lib/api/queries/Education/mutations/cabinet/useDeleteSection';
import { useAddMaterial } from '@/lib/api/queries/Education/mutations/material/useAddMaterial';
import { useDeleteMaterial } from '@/lib/api/queries/Education/mutations/material/useDeleteMaterial';
import { SectionCard } from '@/components/pages/Education/SectionCard';
import { SectionForm } from '@/components/pages/Education/SectionForm';
import FullPageLoader from '@/components/common/Loader/FullPageLoader';

export const SelfDevelopmentPage = () => {
	const { data: cabinet, isLoading } = useEducationCabinetByTitle(
		'Материалы для саморазвития',
	);
	const { isAdmin } = useAuth();
	// TODO: add material by link
	const { mutateAsync: createCabinet, isPending: createLoading } =
		useCreateCabinet();
	const [showForm, setShowForm] = useState(false);
	const { mutateAsync: createSection } = useCreateSection();
	const { mutateAsync: deleteSection } = useDeleteSection();
	const { mutateAsync: addMaterial, isPending: materialLoading } =
		useAddMaterial();
	const { mutateAsync: deleteMaterial } = useDeleteMaterial();
	const handleCreateCabinet = async () => {
		const formData = new FormData();
		formData.append('title', 'Материалы для саморазвития');
		formData.append('isSeparateCabinet', 'true');
		await createCabinet(formData);
	};

	const handleAddSection = async (
		sectionData: Omit<
			TrainingSection,
			'id' | 'materials' | 'createdAt' | 'updatedAt' | 'cabinetId'
		>,
	) => {
		if (cabinet) {
			const newSection: Omit<
				TrainingSection,
				'id' | 'materials' | 'createdAt' | 'updatedAt'
			> = {
				title: sectionData.title,
				cabinetId: cabinet.id,
			};
			await createSection(newSection);
			setShowForm(false);
		}
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
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
				<h1 className="text-2xl font-bold mb-2 sm:mb-0">
					Материалы для саморазвития
				</h1>

				{isAdmin && !cabinet && !isLoading && (
					<Button
						onClick={() => handleCreateCabinet()}
						disabled={createLoading}
					>
						{createLoading ? (
							<Loader2 className="animate-spin mr-2" />
						) : (
							<PlusCircle className="mr-2 h-4 w-4" />
						)}
						Создать кабинет
					</Button>
				)}
			</div>

			{isLoading && <FullPageLoader />}

			{cabinet?.sections && (
				<>
					<div className="grid grid-cols-2 gap-6">
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
					</div>
					{isAdmin && (
						<div className={'mt-6'}>
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
						</div>
					)}
				</>
			)}
		</div>
	);
};
