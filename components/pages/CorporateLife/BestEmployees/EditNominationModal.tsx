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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Search, Users } from 'lucide-react';
import { UpdateNominationDto } from '@/lib/api/queries/Content/mutations/nomination/useUpdateNomination';
import { useUsers } from '@/lib/api/queries/Users/useUsers';
import { UserData } from '@/types/entities';
import { Nomination } from '@/types/content';

interface EditNominationModalProps {
	isOpen: boolean;
	onClose: () => void;
	nomination: Nomination;
	onSave?: (data: UpdateNominationDto) => void;
	isLoading?: boolean;
}

export function EditNominationModal({
	isOpen,
	onClose,
	nomination,
	onSave,
	isLoading,
}: EditNominationModalProps) {
	const { data: users } = useUsers();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		if (nomination) {
			setTitle(nomination.title);
			setDescription(nomination.description || '');
			setSelectedUserIds(nomination.nominants.map((n) => n.id));
		}
	}, [nomination]);

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
		if (!title.trim() || !nomination.id) return;

		if (onSave) {
			onSave({
				id: nomination.id,
				title: title.trim(),
				description: description.trim() || undefined,
				nominantsIds: selectedUserIds,
			});
		}
	};

	const handleClose = () => {
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
					<DialogTitle>Редактировать номинацию</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col flex-1 overflow-hidden p-1"
				>
					<div className="space-y-4 flex-shrink-0">
						<div className="space-y-2">
							<Label htmlFor="title">Название номинации</Label>
							<Input
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
							/>
						</div>

						<div className="space-y-2">
							<Label>Номинанты</Label>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									placeholder="Поиск сотрудников..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10"
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
										{user.position && (
											<p className="text-sm text-gray-500 truncate">
												{user?.position?.title}
											</p>
										)}
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
							{isLoading ? 'Сохранение...' : 'Сохранить изменения'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
