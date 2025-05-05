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
import { useCreatePosition } from '@/lib/api/queries/Structure/mutations/useCreatePosition';
import { Loader2 } from 'lucide-react';

interface CreatePositionModalProps {
	isOpen: boolean;
	onClose: () => void;
	departmentId: string;
}

export default function CreatePositionModal({
	isOpen,
	onClose,
	departmentId,
}: CreatePositionModalProps) {
	const [title, setTitle] = useState('');
	const { mutate: createPosition, isPending } = useCreatePosition();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim()) return;

		createPosition(
			{
				title,
				departmentId,
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
					<DialogTitle>Создать должность</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="title">Название должности</Label>
							<Input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Введите название должности"
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
