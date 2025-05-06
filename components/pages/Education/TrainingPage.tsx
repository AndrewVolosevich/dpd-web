'use client';

import { Button } from '@/components/ui/button';
import { CabinetCard } from './Cabinets/CabinetCard';
import { useState } from 'react';
import { TrainingCabinet } from '@/types/education';
import { useAuth } from '@/components/providers/global/AuthProvider';
import useEducationCabinetsList from '@/lib/api/queries/Education/useEducationCabinetsList';
import { PlusCircle } from 'lucide-react';
import { CreateCabinetModal } from '@/components/pages/Education/Cabinets/CreateCabinetModal';
import { DeleteCabinetModal } from '@/components/pages/Education/Cabinets/DeleteCabinetModal';
import { useCreateCabinet } from '@/lib/api/queries/Education/mutations/cabinet/useCreateCabinet';
import { useDeleteCabinet } from '@/lib/api/queries/Education/mutations/cabinet/useDeleteCabinet';
import { EditCabinetModal } from '@/components/pages/Education/Cabinets/EditCabinetModal';
import { useEditCabinet } from '@/lib/api/queries/Education/mutations/cabinet/useEditCabinet';

export const TrainingPage = () => {
	const { data: cabinets } = useEducationCabinetsList();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [cabinetToEdit, setCabinetToEdit] = useState<TrainingCabinet | null>(
		null,
	);
	const [cabinetToDelete, setCabinetToDelete] =
		useState<TrainingCabinet | null>(null);

	const { isAdmin } = useAuth();
	// TODO: add material by link
	const { mutateAsync: createCabinet, isPending: createLoading } =
		useCreateCabinet();
	const { mutateAsync: editCabinet, isPending: editLoading } = useEditCabinet();
	const { mutateAsync: deleteCabinet } = useDeleteCabinet();

	const handleCreateCabinet = async (file: File | null, title: string) => {
		if (file && title.trim() !== '') {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('title', title);
			await createCabinet(formData);
			setIsCreateModalOpen(false);
		}
	};

	const handleEditCabinet = async (file: File | null, title: string) => {
		if (cabinetToEdit?.id && (file || title.trim() !== '')) {
			const formData = new FormData();
			formData.append('file', file || '');
			formData.append('title', title);
			await editCabinet({ formData, cabinetId: cabinetToEdit?.id });
			setIsEditModalOpen(false);
		}
	};

	const handleDeleteClick = (cabinet: TrainingCabinet) => {
		setCabinetToDelete(cabinet);
		setIsDeleteModalOpen(true);
	};

	const handleEditClick = (cabinet: TrainingCabinet) => {
		setCabinetToEdit(cabinet);
		setIsEditModalOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (cabinetToDelete) {
			await deleteCabinet(cabinetToDelete);
			setIsDeleteModalOpen(false);
			setCabinetToDelete(null);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
				<h1 className="text-2xl font-bold mb-2 sm:mb-0">Обучение</h1>

				{isAdmin && (
					<Button onClick={() => setIsCreateModalOpen(true)}>
						<PlusCircle className="mr-2 h-4 w-4" />
						Создать кабинет
					</Button>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{!!cabinets?.length &&
					cabinets.map((cabinet) => (
						<div key={cabinet.id} className="relative group">
							<CabinetCard
								id={cabinet.id}
								title={cabinet.title}
								imageUrl={cabinet.imageUrl}
							/>

							{isAdmin && (
								<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
									<Button
										className={'mr-2'}
										variant="outline"
										size="sm"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											handleEditClick(cabinet);
										}}
									>
										Редактировать
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											handleDeleteClick(cabinet);
										}}
									>
										Удалить
									</Button>
								</div>
							)}
						</div>
					))}
			</div>

			<CreateCabinetModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSubmit={handleCreateCabinet}
				isLoading={createLoading}
			/>

			<EditCabinetModal
				isOpen={isEditModalOpen && !!cabinetToEdit}
				onClose={() => setIsEditModalOpen(false)}
				onSubmit={handleEditCabinet}
				cabinet={cabinetToEdit}
				isLoading={editLoading}
			/>

			{cabinetToDelete && (
				<DeleteCabinetModal
					isOpen={isDeleteModalOpen}
					onClose={() => setIsDeleteModalOpen(false)}
					onConfirm={handleConfirmDelete}
					cabinetTitle={cabinetToDelete.title}
				/>
			)}
		</div>
	);
};
