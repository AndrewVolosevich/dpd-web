import React, { useState } from 'react';
import { Nomination } from '@/types/content';
import { UserData } from '@/types/entities';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserCard from '@/components/pages/Home/UserCard';
import { EditNominationModal } from '@/components/pages/CorporateLife/BestEmployees/EditNominationModal';
import {
	UpdateNominationDto,
	useUpdateNomination,
} from '@/lib/api/queries/Content/mutations/nomination/useUpdateNomination';
import { DeleteNominationModal } from '@/components/pages/CorporateLife/BestEmployees/DeleteNominationModal';
import { useDeleteNomination } from '@/lib/api/queries/Content/mutations/nomination/useDeleteNomination';

const containerClasses = 'container mx-auto p-4 h-full';

const NominationsList = ({ nominations }: { nominations: Nomination[] }) => {
	const { isAdmin } = useAuth();
	const [editingNomination, setEditingNomination] = useState<Nomination | null>(
		null,
	);
	const [deletingNomination, setDeletingNomination] =
		useState<Nomination | null>(null);

	const { mutate: updateNomination, isPending: updateNominationLoading } =
		useUpdateNomination();
	const { mutate: deleteNomination, isPending: deleteNominationLoading } =
		useDeleteNomination();

	const handleEditNomination = (nomination: UpdateNominationDto) => {
		updateNomination(nomination, {
			onSettled: () => {
				setEditingNomination(null);
			},
		});
	};
	const handleDeleteNomination = (id: string) => {
		deleteNomination(id, { onSettled: () => setDeletingNomination(null) });
	};

	return (
		<div className={containerClasses}>
			{nominations.map((nomination) => (
				<Card key={nomination.id} className="relative border-0 shadow-md mb-4">
					<CardHeader className="pb-4">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<CardTitle className="text-xl mb-2">
									{nomination.title}
								</CardTitle>
								{nomination.description && (
									<p className="text-gray-600 text-sm">
										{nomination.description}
									</p>
								)}
								<div className="flex items-center gap-2 mt-2">
									<Users className="w-4 h-4 text-gray-500" />
									<span className="text-sm text-gray-500">
										{nomination.nominants.length} номинантов
									</span>
								</div>
							</div>

							{isAdmin && (
								<div className="flex gap-2 ml-4">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setEditingNomination(nomination)}
										className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
									>
										<Edit className="w-4 h-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setDeletingNomination(nomination)}
										className="text-gray-500 hover:bg-primary hover:bg-red-50"
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							)}
						</div>
					</CardHeader>

					<CardContent>
						{nomination.nominants.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{nomination.nominants.map((nominant) => (
									<div
										key={nominant.id}
										className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
									>
										<UserCard user={nominant as UserData} full />
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-8 text-gray-500">
								<Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
								<p>Номинанты не добавлены</p>
							</div>
						)}
					</CardContent>
				</Card>
			))}

			{nominations.length === 0 && (
				<div className="text-center py-12">
					<Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						Нет номинаций
					</h3>
					<p className="text-gray-500">
						Добавьте первую номинацию для отображения лучших сотрудников
					</p>
				</div>
			)}

			{/* Edit Modal */}
			{editingNomination && (
				<EditNominationModal
					isOpen={!!editingNomination}
					onClose={() => setEditingNomination(null)}
					onSave={handleEditNomination}
					nomination={editingNomination}
					isLoading={updateNominationLoading}
				/>
			)}

			{/* Delete Modal */}
			{deletingNomination && (
				<DeleteNominationModal
					isOpen={!!deletingNomination}
					onClose={() => setDeletingNomination(null)}
					nomination={deletingNomination}
					onDelete={handleDeleteNomination}
					isLoading={deleteNominationLoading}
				/>
			)}
		</div>
	);
};

export default NominationsList;
