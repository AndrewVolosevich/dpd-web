'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { CabinetForm } from './CabinetForm';
import type { TrainingCabinet } from '@/types/education';

interface EditCabinetModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (file: File | null, title: string) => void;
	cabinet: TrainingCabinet | null;
	isLoading: boolean;
}

export const EditCabinetModal = ({
	isOpen,
	onClose,
	onSubmit,
	cabinet,
	isLoading,
}: EditCabinetModalProps) => {
	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Редактировать кабинет</DialogTitle>
				</DialogHeader>
				{cabinet && (
					<CabinetForm
						onSubmit={onSubmit}
						onCancel={handleClose}
						initialData={cabinet}
						isLoading={isLoading}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
};
