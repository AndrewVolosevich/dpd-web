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
import { UpdateTopOfficialModal } from '@/components/pages/About/SubPages/TopOfficials/modals/UpdateTopOfficialModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { TopOfficial } from '@/types/content';
import { useCreateTopOfficial } from '@/lib/api/queries/Content/mutations/useCreateTopOfficial';
import useTopOfficials from '@/lib/api/queries/Content/useTopOfficials';
import TopOfficialCard from '@/components/pages/About/SubPages/TopOfficials/TopOfficialCard';
import { useUpdateTopOfficial } from '@/lib/api/queries/Content/mutations/useUpdateTopOfficial';
import { DeleteTopOfficialModal } from '@/components/pages/About/SubPages/TopOfficials/modals/DeleteTopOfficialModal';
import { useDeleteTopOfficial } from '@/lib/api/queries/Content/mutations/useDeleteTopOfficial';

const HeadPage = () => {
	const { isAdmin } = useAuth();
	const [open, setOpen] = useState(false);
	const [openDelete, setOpenDelete] = useState<string>('');
	const [topToEdit, setTopToEdit] = useState<null | TopOfficial>(null);

	const { data } = useTopOfficials();
	const { mutate: createTopOfficial, isPending: createLoading } =
		useCreateTopOfficial();
	const { mutate: updateTopOfficial, isPending: updateLoading } =
		useUpdateTopOfficial();
	const { mutate: deleteTopOfficial } = useDeleteTopOfficial();

	const handleSubmitTopOfficial = (
		file: File | null,
		data: Partial<TopOfficial>,
	) => {
		const formData = new FormData();
		formData.append('file', file || '');
		formData.append('name', data?.name || '');
		formData.append('jobTitle', data?.jobTitle || '');
		formData.append('content', data?.content || '');
		if (topToEdit?.id) {
			updateTopOfficial(
				{ id: topToEdit?.id, formData },
				{
					onSettled: () => {
						setOpen(false);
					},
				},
			);
		} else {
			createTopOfficial(formData, {
				onSettled: () => {
					setOpen(false);
				},
			});
		}
	};

	const handleEdit = (top: TopOfficial) => {
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
			deleteTopOfficial(id);
			setOpenDelete('');
		}
	};
	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			<Breadcrumb>
				<BreadcrumbList className="p-0 list-none">
					<BreadcrumbItem>
						<BreadcrumbLink href="/public">Главная</BreadcrumbLink>
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
			<div className={'flex flex-row justify-between items-center mb-4'}>
				<div>Первые лица DPD Беларусь</div>
				{isAdmin && (
					<Button variant={'outline'} onClick={() => setOpen(true)}>
						Добавить
						<Plus className={'h-4 w-4 ml-2'} />
					</Button>
				)}
			</div>

			<div>
				{data?.map((top) => (
					<TopOfficialCard
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

			<UpdateTopOfficialModal
				isOpen={open}
				isLoading={createLoading || updateLoading}
				topOfficial={topToEdit}
				onClose={() => {
					setOpen(false);
					setTopToEdit(null);
				}}
				onSubmit={handleSubmitTopOfficial}
			/>
			<DeleteTopOfficialModal
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

export default HeadPage;
