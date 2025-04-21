'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { CabinetForm } from './CabinetForm';
import type { TrainingCabinet } from '@/types/education';

interface CreateCabinetModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (cabinet: Omit<TrainingCabinet, 'id' | 'sections'>) => void;
}

export const CreateCabinetModal = ({
	isOpen,
	onClose,
	onSubmit,
}: CreateCabinetModalProps) => {
	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Создать новый кабинет</DialogTitle>
				</DialogHeader>
				<CabinetForm onSubmit={onSubmit} onCancel={handleClose} />
			</DialogContent>
		</Dialog>
	);
};
