import React, { useState } from 'react';
import { Edit, Settings, Trash2, User, UsersRound, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditPositionModal from '@/components/pages/Admin/Structure/EditPositionModal';
import DeletePositionModal from '@/components/pages/Admin/Structure/modals/DeletePositionModal';
import AssignUserModal from '@/components/pages/Admin/Structure/modals/AssignUserModal';
import UnAssignUserModal from '@/components/pages/Admin/Structure/UnAssignUserModal';
import { Position } from '@/types/structure';
import AddSupervisorPanelModal from '@/components/pages/Education/SupervisorPanel/Modals/AddSupervisorPanelModal';
import { useAssignSupervisorPanel } from '@/lib/api/queries/Structure/mutations/useAssignSupervisorPanel';
import ReassignUserModal from '@/components/pages/Admin/Structure/modals/ReassignUserModal';

const PositionItem = ({ position }: { position: Position }) => {
	const [editingPosition, setEditingPosition] = useState<string | null>(null);
	const [deletingPosition, setDeletingPosition] = useState<string | null>(null);
	const [assigningPosition, setAssigningPosition] = useState<string | null>(
		null,
	);
	const [reassigningPosition, setReassigningPosition] = useState<string | null>(
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
					tooltip={'Добавить панель руководителя'}
				>
					<Settings className="h-4 w-4 mr-1" />
					<span className="text-xs">Панель руководителя</span>
				</Button>
				{!position?.userId && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setAssigningPosition(position.id)}
						tooltip={'Назначить на должность'}
					>
						<User className="h-4 w-4" />
					</Button>
				)}
				{position?.userId && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setReassigningPosition(position.id)}
						tooltip={'Перевести с должности'}
					>
						<UsersRound className="h-4 w-4" />
					</Button>
				)}
				{position?.userId && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {
							setUnAssigningPosition(true);
							setAssigningPosition(position.id);
						}}
						tooltip={'Снять с должности'}
					>
						<UserX className="h-4 w-4" />
					</Button>
				)}
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setEditingPosition(position.id)}
					tooltip={'Редактировать должность'}
				>
					<Edit className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setDeletingPosition(position.id)}
					tooltip={'Удалить должность'}
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
			<ReassignUserModal
				isOpen={reassigningPosition === position?.id && !unAssigningPosition}
				onClose={() => setReassigningPosition(null)}
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
