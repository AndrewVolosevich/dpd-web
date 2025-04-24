'use client';

import { useState } from 'react';
import { Edit, Trash2, User, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/common/Loader/Loader';
import EditPositionModal from './EditPositionModal';
import DeletePositionModal from './DeletePositionModal';
import AssignUserModal from './AssignUserModal';
import { useDepartmentPositions } from '@/lib/api/queries/structure/useDepartmentPositions';
import UnAssignUserModal from '@/components/pages/Admin/Structure/UnAssignUserModal';

interface PositionsListProps {
	departmentId: string;
}

export default function PositionsList({ departmentId }: PositionsListProps) {
	const { data: positions, isLoading } = useDepartmentPositions(departmentId);
	const [editingPosition, setEditingPosition] = useState<string | null>(null);
	const [deletingPosition, setDeletingPosition] = useState<string | null>(null);
	const [assigningPosition, setAssigningPosition] = useState<string | null>(
		null,
	);
	const [unAssigningPosition, setUnAssigningPosition] =
		useState<boolean>(false);

	if (isLoading) {
		return (
			<div className="ml-10 my-2 p-4 bg-white rounded-md">
				<Loader />
			</div>
		);
	}

	if (!positions || positions.length === 0) {
		return (
			<div className="ml-10 my-2 p-4 bg-white rounded-md text-center text-gray-500">
				В этом отделе нет должностей
			</div>
		);
	}

	return (
		<div className="ml-10 my-2 pr-2">
			{positions.map((position) => (
				<div
					key={position.id}
					className="p-3 mb-2 bg-white border rounded-md flex items-center justify-between hover:bg-gray-50 transition-colors"
				>
					<div className="flex-1">
						<div className="font-medium">{position.title}</div>
						{position.users && position.users.length > 0 ? (
							<div className="text-sm text-gray-500 mt-1">
								{position.users.map((user) => (
									<div key={user.id} className="flex items-center">
										<User className="h-3 w-3 mr-1" />
										{user.surname} {user.name} {user.patronymic}
									</div>
								))}
							</div>
						) : (
							<div className="text-sm text-gray-400 italic mt-1">
								Вакантная должность
							</div>
						)}
					</div>

					<div className="flex space-x-1">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setAssigningPosition(position.id)}
						>
							<User className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setUnAssigningPosition(true);
								setAssigningPosition(position.id);
							}}
						>
							<UserX className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setEditingPosition(position.id)}
						>
							<Edit className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setDeletingPosition(position.id)}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>

					<EditPositionModal
						isOpen={editingPosition === position.id}
						onClose={() => setEditingPosition(null)}
						position={position}
					/>

					<DeletePositionModal
						isOpen={deletingPosition === position.id}
						onClose={() => setDeletingPosition(null)}
						position={position}
					/>

					<AssignUserModal
						isOpen={assigningPosition === position?.id && !unAssigningPosition}
						onClose={() => setAssigningPosition(null)}
						position={position}
					/>
					<UnAssignUserModal
						isOpen={assigningPosition === position?.id && unAssigningPosition}
						onClose={() => {
							setAssigningPosition(null);
							setUnAssigningPosition(false);
						}}
						position={position}
					/>
				</div>
			))}
		</div>
	);
}
