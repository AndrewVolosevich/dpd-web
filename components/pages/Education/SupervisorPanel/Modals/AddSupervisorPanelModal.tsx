'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface AddSupervisorPanelModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: () => void;
}

export default function AddSupervisorPanelModal({
	isOpen,
	onClose,
	onSubmit,
}: AddSupervisorPanelModalProps) {
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		setIsSaving(true);

		// Логика сохранения панели руководителя
		// Например, отправка на API
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setIsSaving(false);
		onSubmit();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Создание панели руководителя</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<p>Добавить панель руководителя к должности</p>
				</div>
				<div className="flex justify-end space-x-2 mt-4">
					<Button variant="outline" onClick={onClose} disabled={isSaving}>
						Отмена
					</Button>
					<Button onClick={handleSave} disabled={isSaving}>
						{isSaving ? 'Сохранение...' : 'Сохранить'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
