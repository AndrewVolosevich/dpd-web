import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import EditUserForm from '@/components/pages/Profile/EditUserForm';
import { UserData } from '@/types/entities';

interface EditUserModalProps {
	user?: UserData;
	open: boolean;
	isSelf: boolean;
	onClose: () => void;
}

const EditUserModal = ({ user, open, onClose, isSelf }: EditUserModalProps) => {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>
						{user ? 'Редактировать профиль' : 'Создать профиль'}
					</DialogTitle>
				</DialogHeader>
				<EditUserForm user={user} onClose={onClose} isSelf={isSelf} />
			</DialogContent>
		</Dialog>
	);
};

export default EditUserModal;
