'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
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
import { useUpdateDepartment } from '@/lib/api/queries/Structure/mutations/useUpdateDepartment';
import { Loader2 } from 'lucide-react';

interface EditDepartmentModalProps {
	isOpen: boolean;
	onClose: () => void;
	department: Department;
}

export default function EditDepartmentModal({
	isOpen,
	onClose,
	department,
}: EditDepartmentModalProps) {
	const [title, setTitle] = useState(department.title);
	const { mutate: updateDepartment, isPending } = useUpdateDepartment();

	useEffect(() => {
		if (isOpen) {
			setTitle(department.title);
		}
	}, [isOpen, department]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim()) return;

		updateDepartment(
			{
				id: department.id,
				title,
			},
			{
				onSuccess: () => {
					onClose();
				},
			},
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Редактировать департамент</DialogTitle>
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
						<Button
							type="submit"
							disabled={
								isPending || !title.trim() || title === department.title
							}
						>
							{isPending ? <Loader2 className="animate-spin mr-2" /> : null}
							Сохранить
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
