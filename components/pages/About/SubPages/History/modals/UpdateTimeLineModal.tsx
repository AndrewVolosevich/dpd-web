'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { TimeLine } from '@/types/content';
import { TimeLineForm } from '@/components/pages/About/SubPages/History/TimeLineForm';

interface UpdateTimeLineModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: TimeLine) => void;
	isLoading: boolean;
	timeLine?: TimeLine | null;
	isCreate?: boolean;
}

export const UpdateTimeLineModal = ({
	isOpen,
	onClose,
	onSubmit,
	isLoading,
	timeLine,
	isCreate = false,
}: UpdateTimeLineModalProps) => {
	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>
						{isCreate ? 'Создание данных года' : 'Редактирование данных года'}
					</DialogTitle>
				</DialogHeader>
				<TimeLineForm
					onSubmit={onSubmit}
					isLoading={isLoading}
					onCancel={onClose}
					initialData={timeLine}
				/>
			</DialogContent>
		</Dialog>
	);
};
