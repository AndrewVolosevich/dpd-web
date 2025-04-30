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
import { useCreateCabinet } from '@/lib/api/queries/Education/mutations/useCreateCabinet';
import { useDeleteCabinet } from '@/lib/api/queries/Education/mutations/useDeleteCabinet';

export const TrainingPage = () => {
	const { data: cabinets } = useEducationCabinetsList();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [cabinetToDelete, setCabinetToDelete] =
		useState<TrainingCabinet | null>(null);

	const { isAdmin } = useAuth();
	// TODO: add material by link
	const { mutateAsync: createCabinet } = useCreateCabinet();
	const { mutateAsync: deleteCabinet } = useDeleteCabinet();

	const handleCreateCabinet = async (
		cabinetData: Omit<TrainingCabinet, 'id' | 'sections'>,
	) => {
		createCabinet(cabinetData);
		setIsCreateModalOpen(false);
	};

	const handleDeleteClick = (cabinet: TrainingCabinet) => {
		setCabinetToDelete(cabinet);
		setIsDeleteModalOpen(true);
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
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Обучение</h1>

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
