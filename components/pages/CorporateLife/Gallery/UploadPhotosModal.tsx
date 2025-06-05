'use client';

import type React from 'react';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { UploadPhotosForm } from '@/components/pages/CorporateLife/Gallery/UploadPhotosForm';

interface UploadPhotosModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function UploadPhotosModal({
	isOpen,
	onClose,
}: UploadPhotosModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Cоздать альбом</DialogTitle>
				</DialogHeader>

				<UploadPhotosForm onCancel={onClose} />
			</DialogContent>
		</Dialog>
	);
}
