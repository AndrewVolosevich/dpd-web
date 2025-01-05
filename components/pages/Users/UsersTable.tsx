'use client';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import FullPageLoader from '@/components/common/Loader/FullPageLoader';
import usePaginatedUsers from '@/lib/api/queries/Users/usePaginatedUsers';
import { useAuth } from '@/components/providers/global/AuthProvider';
import EditUserModal from '@/components/pages/Profile/EditUserModal';
import { UserData } from '@/types/entities';
import DeleteAlert from '@/components/common/DeleteAlert/DeleteAlert';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import useApi from '@/hooks/useApi';

const limit = 20;

export default function UsersTable() {
	const [page, setPage] = useState(1);
	const [open, setOpen] = React.useState(false);
	const api = useApi();
	const queryClient = useQueryClient();

	const [updatedUser, setUpdatedUser] = useState<undefined | UserData>(
		undefined,
	);
	const { data, isLoading } = usePaginatedUsers({ limit, page });
	const { isAdmin, user } = useAuth();

	const handlePrev = () => {
		if (page <= 1) {
			return;
		}
		setPage((old) => old - 1);
	};
	const handleNext = () => {
		if (page >= (data?.total || 1) / limit) {
			return;
		}
		setPage((old) => old + 1);
	};

	const { mutate: deleteUser } = useMutation({
		mutationFn: async (userId: string) => {
			return api(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/${userId}`, {
				method: 'DELETE',
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление пользователя',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['paginated-users'] });
			toast({
				title: 'Пользователь успешно удален',
				variant: 'default',
			});
		},
	});

	if (isLoading) {
		return <FullPageLoader />;
	}

	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			<div className={'flex flex-row justify-between items-start'}>
				<h1 className="text-2xl font-bold mb-6">Работники компании</h1>

				{isAdmin && (
					<Button onClick={() => setOpen(true)} type={'button'}>
						Добавить нового работника
					</Button>
				)}
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Работник</TableHead>
							<TableHead>Телефон</TableHead>
							<TableHead>Отдел</TableHead>
							<TableHead>Должность</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center h-24">
									Загрузка...
								</TableCell>
							</TableRow>
						) : data?.data?.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center h-24">
									Нет данных
								</TableCell>
							</TableRow>
						) : (
							data?.data?.map((user) => (
								<TableRow key={user.tel}>
									<TableCell>
										{user?.surname} {user?.name}
									</TableCell>
									<TableCell>{user?.tel}</TableCell>
									<TableCell>{user?.department || '-'}</TableCell>
									<TableCell>{user?.position || '-'}</TableCell>
									<TableCell className={'flex flex-row justify-end'}>
										<div className="flex gap-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => {
													setUpdatedUser(user);
													setOpen(true);
												}}
											>
												<Pencil className="h-4 w-4" />
												<span className="sr-only">Редактировать</span>
											</Button>
											<DeleteAlert onProceed={() => deleteUser(user?.id)} />
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href="#"
							onClick={handlePrev}
							disabled={page <= 1}
						/>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#">{page}</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationNext
							href="#"
							onClick={handleNext}
							disabled={page >= data?.total / limit}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
			{isAdmin && (
				<EditUserModal
					open={open}
					user={updatedUser}
					onClose={() => setOpen(false)}
					isSelf={user?.id === updatedUser?.id}
				/>
			)}
		</div>
	);
}
