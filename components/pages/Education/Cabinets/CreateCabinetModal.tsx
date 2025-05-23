'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { CabinetForm } from './CabinetForm';

interface CreateCabinetModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (file: File | null, title: string) => void;
	isLoading: boolean;
}

export const CreateCabinetModal = ({
	isOpen,
	onClose,
	onSubmit,
	isLoading,
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
				<CabinetForm
					onSubmit={onSubmit}
					onCancel={handleClose}
					isLoading={isLoading}
				/>
			</DialogContent>
		</Dialog>
	);
};
