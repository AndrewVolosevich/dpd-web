'use client';

import { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { toast } from '@/hooks/use-toast';
import type { UserData } from '@/types/entities';

interface TestAssignmentModalProps {
	open: boolean;
	onClose: () => void;
	testId: string;
}

export function TestAssignmentModal({
	open,
	onClose,
	testId,
}: TestAssignmentModalProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const api = useApi();
	const queryClient = useQueryClient();

	// Fetch all users
	const { data: users = [] } = useQuery({
		queryKey: ['users-for-assignment'],
		queryFn: async (): Promise<UserData[]> => {
			const resp = await api.post(`/auth/get-users`, {});
			return resp?.data || [];
		},
	});

	// Fetch current test assignments
	const { data: test } = useQuery({
		queryKey: ['test-assignments', testId],
		queryFn: async () => {
			const resp = await api.get(`/surveys/${testId}`);
			return resp?.data;
		},
		enabled: !!testId && open,
	});

	// Set initial selected users based on current assignments
	useEffect(() => {
		if (test?.assignments) {
			setSelectedUserIds(
				test.assignments.map((assignment: any) => assignment.userId),
			);
		}
	}, [test]);

	// Filter users based on search query
	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.surname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.tel.includes(searchQuery),
	);

	const { mutate: assignTest, isPending } = useMutation({
		mutationFn: async (data: { surveyId: string; userIds: string[] }) => {
			return api.post(`/surveys/assign`, data);
		},
		onError: (error) => {
			toast({
				title: 'Ошибка при назначении теста',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['test-assignments'] });
			queryClient.invalidateQueries({ queryKey: ['survey'] });
			toast({
				title: 'Тест успешно назначен',
				variant: 'default',
			});
			onClose();
		},
	});

	const toggleSelectAll = () => {
		if (selectedUserIds.length === users.length) {
			setSelectedUserIds([]);
		} else {
			setSelectedUserIds(users.map((user) => user.id));
		}
	};

	const toggleUser = (userId: string) => {
		if (selectedUserIds.includes(userId)) {
			setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
		} else {
			setSelectedUserIds([...selectedUserIds, userId]);
		}
	};

	const handleSubmit = () => {
		assignTest({
			surveyId: testId,
			userIds: selectedUserIds,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Назначить тест</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Поиск пользователей..."
							className="pl-8"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="flex items-center space-x-2">
						<Checkbox
							id="select-all"
							checked={
								selectedUserIds.length === users.length && users.length > 0
							}
							onCheckedChange={toggleSelectAll}
						/>
						<Label htmlFor="select-all" className="text-sm font-medium">
							{selectedUserIds.length === users.length && users.length > 0
								? 'Снять выделение со всех'
								: 'Выбрать всех пользователей'}
						</Label>
					</div>

					<ScrollArea className="h-[300px] pr-4">
						<div className="space-y-2">
							{filteredUsers.map((user) => (
								<div key={user.id} className="flex items-center space-x-2">
									<Checkbox
										id={`user-${user.id}`}
										checked={selectedUserIds.includes(user.id)}
										onCheckedChange={() => toggleUser(user.id)}
									/>
									<Label
										htmlFor={`user-${user.id}`}
										className="flex-1 cursor-pointer"
									>
										<div className="flex justify-between">
											<span>
												{user.surname} {user.name}
											</span>
											<span className="text-muted-foreground text-sm">
												{user.tel}
											</span>
										</div>
										{user.position && (
											<span className="text-xs text-muted-foreground">
												{user.position?.title}
											</span>
										)}
									</Label>
								</div>
							))}
							{filteredUsers.length === 0 && (
								<div className="text-center py-4 text-muted-foreground">
									{searchQuery
										? 'Пользователи не найдены'
										: 'Нет доступных пользователей'}
								</div>
							)}
						</div>
					</ScrollArea>

					<div className="text-sm text-muted-foreground">
						Выбрано пользователей: {selectedUserIds.length} из {users.length}
					</div>

					<div className="text-sm">
						<p className="text-muted-foreground">
							Если не выбран ни один пользователь, тест будет доступен всем.
						</p>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Отмена
					</Button>
					<Button onClick={handleSubmit} disabled={isPending}>
						{isPending ? 'Сохранение...' : 'Сохранить'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
