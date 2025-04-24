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
import type { Position } from '@/types/structure';
import { useUpdatePosition } from '@/lib/api/queries/structure/mutations/useUpdatePosition';
import { Loader2 } from 'lucide-react';

interface EditPositionModalProps {
	isOpen: boolean;
	onClose: () => void;
	position: Position;
}

export default function EditPositionModal({
	isOpen,
	onClose,
	position,
}: EditPositionModalProps) {
	const [title, setTitle] = useState(position.title);
	const { mutate: updatePosition, isPending } = useUpdatePosition();

	useEffect(() => {
		if (isOpen) {
			setTitle(position.title);
		}
	}, [isOpen, position]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim()) return;

		updatePosition(
			{
				id: position.id,
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
					<DialogTitle>Редактировать должность</DialogTitle>
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
						<Button
							type="submit"
							disabled={isPending || !title.trim() || title === position.title}
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
