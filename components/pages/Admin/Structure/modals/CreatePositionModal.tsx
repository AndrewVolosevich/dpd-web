'use client';

import React, { useMemo } from 'react';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCreatePosition } from '@/lib/api/queries/Structure/mutations/useCreatePosition';
import { Loader2 } from 'lucide-react';
import { SearchSelectInput } from '@/components/common/SearchSelectInput/SearchSelectInput';
import { useAllPositions } from '@/lib/api/queries/Structure/useAllPositions';

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
	const { data } = useAllPositions();

	const positions = useMemo(() => {
		return (data?.map((position) => position.title) as string[]) || [];
	}, [data]);

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
			<DialogContent
				className="sm:max-w-[425px]"
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>Создать должность</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<SearchSelectInput
							options={positions}
							inputId={title}
							value={title}
							labelTitle={'Название должности'}
							placeholder={'Введите название должности'}
							inputRequired
							onChange={(e) => setTitle(e)}
							className={'grid gap-2 relative'}
						/>
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
