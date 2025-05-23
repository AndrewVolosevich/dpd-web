import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { UserData } from '@/types/entities';
import UploadUserPhoto from '@/components/pages/Profile/UploadUserPhoto';

interface EditUserPhotoModalProps {
	user?: UserData;
	open: boolean;
	onClose: () => void;
}

const EditUserPhotoModal = ({
	user,
	open,
	onClose,
}: EditUserPhotoModalProps) => {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>{'Редактировать фото профиля'}</DialogTitle>
				</DialogHeader>
				<UploadUserPhoto onClose={onClose} user={user} />
			</DialogContent>
		</Dialog>
	);
};

export default EditUserPhotoModal;
