import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import UploadNewsImage from '@/components/pages/News/UploadNewsImage';

interface EditUserPhotoModalProps {
	open: boolean;
	onClose: (val?: string) => void;
}

const EditUserPhotoModal = ({ open, onClose }: EditUserPhotoModalProps) => {
	return (
		<Dialog open={open} onOpenChange={() => onClose()}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>{'Загрузка заглавного изображения'}</DialogTitle>
				</DialogHeader>
				<UploadNewsImage onClose={onClose} />
			</DialogContent>
		</Dialog>
	);
};

export default EditUserPhotoModal;
