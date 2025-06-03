'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { EmployeeInfoCard } from '@/types/content';
import { EmployeeInfoForm } from '@/components/pages/About/SubPages/EmployeeInfo/EmployeeInfoForm';

interface UpdateTopOfficialModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (file: File | null, data: Partial<EmployeeInfoCard>) => void;
	isLoading: boolean;
	topOfficial?: EmployeeInfoCard | null;
}

export const UpdateEmployeeInfoModal = ({
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
				<EmployeeInfoForm
					onSubmit={onSubmit}
					onCancel={handleClose}
					isLoading={isLoading}
					initialData={topOfficial}
				/>
			</DialogContent>
		</Dialog>
	);
};
