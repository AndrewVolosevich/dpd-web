'use client';
import React, { useState } from 'react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Routes } from '@/const/routes';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { useCreateEmployeeInfoCard } from '@/lib/api/queries/Content/mutations/info-card/useCreateEmployeeInfoCard';
import { useUpdateEmployeeInfoCard } from '@/lib/api/queries/Content/mutations/info-card/useUpdateEmployeeInfoCard';
import { useDeleteEmployeeInfoCard } from '@/lib/api/queries/Content/mutations/info-card/useDeleteEmployeeInfoCard';
import useEmployeeInfoCard from '@/lib/api/queries/Content/useEmployeeInfoCard';
import { EmployeeInfoCard } from '@/types/content';
import EmployeeInfoCardComponent from '@/components/pages/About/SubPages/EmployeeInfo/EmployeeInfoCardComponent';
import { UpdateEmployeeInfoModal } from '@/components/pages/About/SubPages/EmployeeInfo/modals/UpdateEmployeeInfoModal';
import { DeleteEmployeeInfoModal } from '@/components/pages/About/SubPages/EmployeeInfo/modals/DeleteEmployeeInfoModal';

const EmployeeInfoPage = ({ isTopOfficial }: { isTopOfficial?: boolean }) => {
	const { isAdmin } = useAuth();
	const [open, setOpen] = useState(false);
	const [openDelete, setOpenDelete] = useState<string>('');
	const [topToEdit, setTopToEdit] = useState<null | EmployeeInfoCard>(null);

	const { data } = useEmployeeInfoCard(isTopOfficial);
	const { mutate: createEmployeeInfoCard, isPending: createLoading } =
		useCreateEmployeeInfoCard();
	const { mutate: updateEmployeeInfoCard, isPending: updateLoading } =
		useUpdateEmployeeInfoCard();
	const { mutate: deleteEmployeeInfoCard } = useDeleteEmployeeInfoCard();

	const handleSubmitTopOfficial = (
		file: File | null,
		data: Partial<EmployeeInfoCard>,
	) => {
		const formData = new FormData();
		if (file) {
			formData.append('file', file, file?.name);
		}
		formData.append('name', data?.name || '');
		formData.append('jobTitle', data?.jobTitle || '');
		formData.append('content', data?.content || '');
		formData.append('isTop', isTopOfficial ? 'true' : 'false');
		if (topToEdit?.id) {
			updateEmployeeInfoCard(
				{ id: topToEdit?.id, formData },
				{
					onSettled: () => {
						setOpen(false);
					},
				},
			);
		} else {
			createEmployeeInfoCard(formData, {
				onSettled: () => {
					setOpen(false);
				},
			});
		}
	};

	const handleEdit = (top: EmployeeInfoCard) => {
		setTopToEdit(top);
		setOpen(true);
	};
	const handleDelete = (id?: string) => {
		if (id) {
			setOpenDelete(id);
		}
	};
	const handleDeleteTopOfficial = (id?: string) => {
		if (id) {
			deleteEmployeeInfoCard(id);
			setOpenDelete('');
		}
	};
	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			{isTopOfficial && (
				<Breadcrumb>
					<BreadcrumbList className="p-0 list-none">
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Главная</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href={`${Routes.ABOUT}/history`}>
								О компании
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Первые лица DPD Беларусь</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			)}
			<div className={'flex flex-row justify-between items-center mb-4'}>
				<div>
					{isTopOfficial ? 'Первые лица DPD Беларусь' : 'Лучшие Сотрудники'}
				</div>
				{isAdmin && (
					<Button variant={'outline'} onClick={() => setOpen(true)}>
						Добавить
						<Plus className={'h-4 w-4 ml-2'} />
					</Button>
				)}
			</div>

			<div>
				{data?.map((top) => (
					<EmployeeInfoCardComponent
						key={top?.id}
						data={top}
						onEdit={() => {
							handleEdit(top);
						}}
						onDelete={() => {
							handleDelete(top?.id);
						}}
					/>
				))}
			</div>

			<UpdateEmployeeInfoModal
				isOpen={open}
				isLoading={createLoading || updateLoading}
				topOfficial={topToEdit}
				onClose={() => {
					setOpen(false);
					setTopToEdit(null);
				}}
				onSubmit={handleSubmitTopOfficial}
			/>
			<DeleteEmployeeInfoModal
				onClose={() => {
					setOpenDelete('');
				}}
				isOpen={!!openDelete}
				onConfirm={() => {
					handleDeleteTopOfficial(openDelete);
				}}
			/>
		</div>
	);
};

export default EmployeeInfoPage;
