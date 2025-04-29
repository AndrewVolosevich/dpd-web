'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import useApi from '@/hooks/useApi';
import { useQuery } from '@tanstack/react-query';
import type { UserData } from '@/types/entities';

interface UserAssignmentProps {
	assignedUserIds: string[];
	setAssignedUserIds: (ids: string[]) => void;
}

export function UserAssignment({
	assignedUserIds,
	setAssignedUserIds,
}: UserAssignmentProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const api = useApi();

	// Fetch all users
	const { data: users = [] } = useQuery({
		queryKey: ['users-for-assignment'],
		queryFn: async (): Promise<UserData[]> => {
			const resp = await api.post(`/auth/get-users`, {});
			return resp?.data || [];
		},
	});

	// Filter users based on search query
	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.surname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.tel.includes(searchQuery),
	);

	const toggleSelectAll = () => {
		if (assignedUserIds.length === users.length) {
			setAssignedUserIds([]);
		} else {
			setAssignedUserIds(users.map((user) => user.id));
		}
	};

	const toggleUser = (userId: string) => {
		if (assignedUserIds.includes(userId)) {
			setAssignedUserIds(assignedUserIds.filter((id) => id !== userId));
		} else {
			setAssignedUserIds([...assignedUserIds, userId]);
		}
	};

	return (
		<div className="space-y-4">
			<div>
				<Label className="text-base font-medium">
					Назначить тест пользователям
				</Label>
				<p className="text-sm text-muted-foreground mt-1">
					Выберите пользователей, которым будет доступен этот тест. Если не
					выбран ни один пользователь, тест будет доступен всем.
				</p>
			</div>

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
					checked={assignedUserIds.length === users.length && users.length > 0}
					onCheckedChange={toggleSelectAll}
				/>
				<Label htmlFor="select-all" className="text-sm font-medium">
					{assignedUserIds.length === users.length && users.length > 0
						? 'Снять выделение со всех'
						: 'Выбрать всех пользователей'}
				</Label>
			</div>

			<Card>
				<CardContent className="p-4">
					<ScrollArea className="h-[200px] pr-4">
						<div className="space-y-2">
							{filteredUsers.map((user) => (
								<div key={user.id} className="flex items-center space-x-2">
									<Checkbox
										id={`user-${user.id}`}
										checked={assignedUserIds.includes(user.id)}
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
				</CardContent>
			</Card>

			<div className="flex justify-between items-center">
				<span className="text-sm text-muted-foreground">
					Выбрано пользователей: {assignedUserIds.length} из {users.length}
				</span>
				{assignedUserIds.length > 0 && (
					<Button
						variant="outline"
						size="sm"
						onClick={() => setAssignedUserIds([])}
					>
						Очистить выбор
					</Button>
				)}
			</div>
		</div>
	);
}
