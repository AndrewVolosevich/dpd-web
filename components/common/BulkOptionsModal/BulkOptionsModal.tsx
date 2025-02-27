'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface BulkOptionsModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAdd: (options: string[]) => void;
}

export function BulkOptionsModal({
	isOpen,
	onClose,
	onAdd,
}: BulkOptionsModalProps) {
	const [text, setText] = useState('');

	const handleAdd = () => {
		const options = text
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line.length > 0);

		onAdd(options);
		setText('');
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Добавить варианты ответов</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label>Введите варианты ответов (каждый с новой строки)</Label>
						<Textarea
							value={text}
							onChange={(e) => setText(e.target.value)}
							className="min-h-[200px]"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Отмена
					</Button>
					<Button onClick={handleAdd} disabled={!text.trim()}>
						Добавить
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
