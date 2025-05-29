'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { TopOfficial } from '@/types/content';
import { TopOfficialForm } from '@/components/pages/About/SubPages/TopOfficials/TopOfficialForm';

interface UpdateTopOfficialModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (file: File | null, data: Partial<TopOfficial>) => void;
	isLoading: boolean;
	topOfficial?: TopOfficial | null;
}

export const UpdateTopOfficialModal = ({
	isOpen,
	onClose,
	onSubmit,
	isLoading,
	topOfficial,
}: UpdateTopOfficialModalProps) => {
	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Редактирование данных первых лиц</DialogTitle>
				</DialogHeader>
				<TopOfficialForm
					onSubmit={onSubmit}
					onCancel={handleClose}
					isLoading={isLoading}
					initialData={topOfficial}
				/>
			</DialogContent>
		</Dialog>
	);
};
