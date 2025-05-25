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
import { Pencil, Image } from 'lucide-react';
import React, { useState } from 'react';
import FullPageLoader from '@/components/common/Loader/FullPageLoader';
import usePaginatedUsers from '@/lib/api/queries/Users/usePaginatedUsers';
import { useAuth } from '@/components/providers/global/AuthProvider';
import EditUserModal from '@/components/pages/Profile/EditUserModal';
import { UserData } from '@/types/entities';
import DeleteAlert from '@/components/common/DeleteAlert/DeleteAlert';
import Link from 'next/link';
import { useDeleteUser } from '@/lib/api/queries/Users/mutations/useDeleteUser';
import EditUserPhotoModal from '@/components/pages/Profile/EditUserPhotoModal';
import { formatBornDate } from '@/lib/date/helpers';
import { formatPhoneNumber } from '@/lib/phone';

const limit = 20;

export default function UsersTable() {
	const [page, setPage] = useState(1);
	const [open, setOpen] = React.useState(false);
	const [openPhoto, setOpenPhoto] = useState(false);

	const [updatedUser, setUpdatedUser] = useState<undefined | UserData>(
		undefined,
	);
	const [updatedPhotoUser, setUpdatedPhotoUser] = useState<
		undefined | UserData
	>(undefined);
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

	const { mutate: deleteUser } = useDeleteUser();

	if (isLoading) {
		return <FullPageLoader />;
	}

	// Группировка данных по отделам
	const groupedUsers = data?.data.reduce(
		(acc: Record<string, UserData[]>, user) => {
			const departmentTitle = user.department?.title || 'Без отдела';
			if (!acc[departmentTitle]) {
				acc[departmentTitle] = [];
			}
			acc[departmentTitle].push(user);
			return acc;
		},
		{},
	);

	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			<div className={'flex flex-col md:flex-row justify-between items-start'}>
				<h1 className="text-2xl font-bold mb-6">Работники компании</h1>

				{isAdmin && (
					<Button
						onClick={() => setOpen(true)}
						type={'button'}
						className={'mb-4 md:mb-0'}
					>
						Добавить нового работника
					</Button>
				)}
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Работник</TableHead>
							<TableHead>Отдел</TableHead>
							<TableHead>Должность</TableHead>
							<TableHead>Телефон моб.</TableHead>
							<TableHead>Телефон вн.</TableHead>
							<TableHead>Дата рожд</TableHead>
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
							// Рендеринг пользователей с заголовками отделов
							Object.entries(groupedUsers || {}).map(([department, users]) => (
								<React.Fragment key={department}>
									{/* Заголовок отдела */}
									<TableRow>
										<TableCell colSpan={5} className="bg-gray-100 font-bold">
											{department}
										</TableCell>
									</TableRow>
									{/* Список пользователей из отдела */}
									{users.map((user) => (
										<TableRow key={user.id}>
											<TableCell>
												<Link href={`/profile/${user.id}`}>
													{user.surname} {user.name}
												</Link>
											</TableCell>
											<TableCell>{user.department?.title || '-'}</TableCell>
											<TableCell>{user.position?.title || '-'}</TableCell>
											<TableCell>{formatPhoneNumber(user.tel)}</TableCell>
											<TableCell>
												{formatPhoneNumber(user?.internalPhone)}
											</TableCell>
											<TableCell>
												{user?.bornDate ? formatBornDate(user?.bornDate) : ''}
											</TableCell>

											<TableCell className="flex flex-row justify-end">
												{isAdmin && (
													<div className="flex gap-2">
														<Button
															variant="ghost"
															size="icon"
															onClick={() => {
																setUpdatedPhotoUser(user);
																setOpenPhoto(true);
															}}
														>
															<Image className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="icon"
															onClick={() => {
																setUpdatedUser(user);
																setOpen(true);
															}}
														>
															<Pencil className="h-4 w-4" />
														</Button>
														<DeleteAlert
															onProceed={() => deleteUser(user.id)}
														/>
													</div>
												)}
											</TableCell>
										</TableRow>
									))}
								</React.Fragment>
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
							disabled={page >= (data?.total || 0) / limit}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
			{isAdmin && (
				<>
					<EditUserModal
						open={open}
						user={updatedUser}
						onClose={() => {
							setUpdatedUser(undefined);
							setOpen(false);
						}}
						isSelf={user?.id === updatedUser?.id}
					/>
					<EditUserPhotoModal
						open={openPhoto && !!updatedPhotoUser}
						user={updatedPhotoUser}
						onClose={() => {
							setOpenPhoto(false);
							setUpdatedPhotoUser(undefined);
						}}
					/>
				</>
			)}
		</div>
	);
}
