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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Search, Users } from 'lucide-react';
import { useUsers } from '@/lib/api/queries/Users/useUsers';
import { UserData } from '@/types/entities';
import { CreateNominationDto } from '@/lib/api/queries/Content/mutations/nomination/useCreateNomination';

interface CreateNominationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: CreateNominationDto) => void;
	isLoading?: boolean;
}

export function CreateNominationModal({
	isOpen,
	onClose,
	onSave,
	isLoading,
}: CreateNominationModalProps) {
	const { data: users } = useUsers();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState('');

	const filteredUsers = users?.filter((user) => {
		const fullName =
			`${user.surname} ${user.name} ${user.patronymic || ''}`.toLowerCase();
		const position = user.position?.title.toLowerCase() || '';
		const query = searchQuery.toLowerCase();
		return fullName.includes(query) || position.includes(query);
	});

	const handleUserToggle = (userId: string) => {
		setSelectedUserIds((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId],
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		onSave({
			title: title.trim(),
			description: description.trim() || undefined,
			nominantsIds: selectedUserIds,
		});

		// Reset form
		setTitle('');
		setDescription('');
		setSelectedUserIds([]);
		setSearchQuery('');
	};

	const handleClose = () => {
		setTitle('');
		setDescription('');
		setSelectedUserIds([]);
		setSearchQuery('');
		onClose();
	};

	const getFullName = (user: UserData) => {
		return `${user.surname} ${user.name} ${user.patronymic || ''}`.trim();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle>Создать номинацию</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col flex-1 overflow-hidden px-1"
				>
					<div className="space-y-4 flex-shrink-0">
						<div className="space-y-2">
							<Label htmlFor="title">Название номинации</Label>
							<Input
								className={
									'outline-none focus:outline-none focus-visible:outline-none'
								}
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Например: Лучший сотрудник месяца"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Описание (необязательно)</Label>
							<Textarea
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Краткое описание номинации..."
								rows={3}
								className={
									'outline-none focus:outline-none focus-visible:outline-none'
								}
							/>
						</div>

						<div className="space-y-2">
							<Label>Номинанты</Label>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									className={' pl-10'}
									placeholder="Поиск сотрудников..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>
					</div>

					<div className="flex-1 overflow-y-auto mt-4 border rounded-md">
						<div className="p-4 space-y-3">
							{filteredUsers?.map((user) => (
								<div key={user.id} className="flex items-center space-x-3">
									<Checkbox
										id={`user-${user.id}`}
										checked={selectedUserIds.includes(user.id)}
										onCheckedChange={() => handleUserToggle(user.id)}
									/>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-gray-900 truncate">
											{getFullName(user)}
										</p>
									</div>
								</div>
							))}

							{users?.length === 0 && (
								<div className="text-center py-8 text-gray-500">
									<Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
									<p>Сотрудники не найдены</p>
								</div>
							)}
						</div>
					</div>

					<DialogFooter className="flex-shrink-0 mt-4">
						<Button type="button" variant="outline" onClick={handleClose}>
							Отмена
						</Button>
						<Button
							type="submit"
							disabled={!title.trim() || isLoading}
							className="bg-primary hover:brightness-90"
						>
							{isLoading && <Loader2 className={'animate-spin mr-2'} />}
							{isLoading ? 'Создание...' : 'Создать номинацию'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
