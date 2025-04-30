'use client';

import type React from 'react';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Department } from '@/types/structure';
import { Loader2 } from 'lucide-react';
import { useCreateDepartment } from '@/lib/api/queries/Structure/mutations/useCreateDepartment';

interface CreateDepartmentModalProps {
	isOpen: boolean;
	onClose: () => void;
	parentDepartment: Department | null;
}

export default function CreateDepartmentModal({
	isOpen,
	onClose,
	parentDepartment,
}: CreateDepartmentModalProps) {
	const [title, setTitle] = useState('');
	const { mutate: createDepartment, isPending } = useCreateDepartment();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim()) return;

		createDepartment(
			{
				title,
				parentId: parentDepartment?.id || null,
			},
			{
				onSuccess: () => {
					setTitle('');
					onClose();
				},
			},
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{parentDepartment
							? `Создать подотдел в "${parentDepartment.title}"`
							: 'Создать новый департамент'}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="title">Название</Label>
							<Input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Введите название департамента"
								required
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Отмена
						</Button>
						<Button type="submit" disabled={isPending || !title.trim()}>
							{isPending ? <Loader2 className="animate-spin mr-2" /> : null}
							Создать
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
