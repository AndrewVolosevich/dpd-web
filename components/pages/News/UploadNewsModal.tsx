import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import UploadImage from '@/components/common/UploadImage';

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
				<UploadImage onClose={onClose} url={'/upload/update-news-image'} />
			</DialogContent>
		</Dialog>
	);
};

export default EditUserPhotoModal;
