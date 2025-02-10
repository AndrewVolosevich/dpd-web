import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import UploadMagazine from '@/components/pages/CorporateLife/Magazine/UploadMagazine';

interface EditUserPhotoModalProps {
	open: boolean;
	onClose: () => void;
}

const UploadMagazineModal = ({ open, onClose }: EditUserPhotoModalProps) => {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>{'Загрузить журнал'}</DialogTitle>
				</DialogHeader>
				<UploadMagazine onClose={onClose} />
			</DialogContent>
		</Dialog>
	);
};

export default UploadMagazineModal;
