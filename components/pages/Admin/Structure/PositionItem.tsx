import React, { useState } from 'react';
import { Edit, Settings, Trash2, User, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditPositionModal from '@/components/pages/Admin/Structure/EditPositionModal';
import DeletePositionModal from '@/components/pages/Admin/Structure/DeletePositionModal';
import AssignUserModal from '@/components/pages/Admin/Structure/AssignUserModal';
import UnAssignUserModal from '@/components/pages/Admin/Structure/UnAssignUserModal';
import { Position } from '@/types/structure';
import AddSupervisorPanelModal from '@/components/pages/Education/SupervisorPanel/Modals/AddSupervisorPanelModal';
import { useAssignSupervisorPanel } from '@/lib/api/queries/Structure/mutations/useAssignSupervisorPanel';

const PositionItem = ({ position }: { position: Position }) => {
	const [editingPosition, setEditingPosition] = useState<string | null>(null);
	const [deletingPosition, setDeletingPosition] = useState<string | null>(null);
	const [assigningPosition, setAssigningPosition] = useState<string | null>(
		null,
	);
	const [unAssigningPosition, setUnAssigningPosition] =
		useState<boolean>(false);
	const [isSupervisorPanelModalOpen, setIsSupervisorPanelModalOpen] =
		useState(false);
	// Placeholder: проверка, есть ли у департамента назначенная панель руководителя.
	const hasSupervisorPanel = !!position?.supervisedPanelId;
	const { mutate: assignSupervisorPanel } = useAssignSupervisorPanel(
		position?.departmentId,
	);
	return (
		<div
			key={position.id}
			className="p-3 mb-2 bg-white border rounded-md flex items-center justify-between hover:bg-gray-50 transition-colors"
		>
			<div className="flex-1">
				<div className="font-medium">{position.title}</div>
				{position.user ? (
					<div className="text-sm text-gray-500 mt-1">
						<div key={position.user.id} className="flex items-center">
							<User className="h-3 w-3 mr-1" />
							{position.user.surname} {position.user.name}{' '}
							{position.user.patronymic}
						</div>
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
					disabled={hasSupervisorPanel}
					onClick={() => setIsSupervisorPanelModalOpen(true)}
				>
					<Settings className="h-4 w-4 mr-1" />
					<span className="text-xs">Панель руководителя</span>
				</Button>
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
			<AddSupervisorPanelModal
				isOpen={isSupervisorPanelModalOpen}
				onClose={() => setIsSupervisorPanelModalOpen(false)}
				onSubmit={() => {
					assignSupervisorPanel(position.id);
					setIsSupervisorPanelModalOpen(false);
				}}
			/>
		</div>
	);
};

export default PositionItem;
