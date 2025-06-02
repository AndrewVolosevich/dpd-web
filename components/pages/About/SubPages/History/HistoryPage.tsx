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
import TimeLine from '@/components/pages/About/SubPages/History/TimeLine';
import useTimeLine from '@/lib/api/queries/Content/useTimeLine';
import FullPageLoader from '@/components/common/Loader/FullPageLoader';
import { ContextButton, ContextIcons } from '@/components/ui/context-button';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { UpdateTimeLineModal } from '@/components/pages/About/SubPages/History/modals/UpdateTimeLineModal';
import { useCreateTimeLine } from '@/lib/api/queries/Content/mutations/useCreateTimeLine';
import { useUpdateTimeLine } from '@/lib/api/queries/Content/mutations/useUpdateTimeLine';
import timeLine from '@/components/pages/About/SubPages/History/TimeLine';
import { DeleteTimeLineModal } from '@/components/pages/About/SubPages/History/modals/DeleteTimeLineModal';
import { useDeleteTimeLine } from '@/lib/api/queries/Content/mutations/useDeleteTimeLine';

const HistoryPage = () => {
	const { isAdmin } = useAuth();
	const { data: timeLineData, isLoading } = useTimeLine();
	const { mutate: createTimeLine, isPending: createLoading } =
		useCreateTimeLine();
	const { mutate: updateTimeLine, isPending: updateLoading } =
		useUpdateTimeLine();
	const { mutate: deleteTimeLine, isPending: deleteLoading } =
		useDeleteTimeLine();

	const [createOpen, setCreateOpen] = useState(false);
	const [itemToEdit, setItemToEdit] = useState<null | TimeLine>(null);
	const [yearToDelete, setYearToDelete] = useState<null | number>(null);

	const handleDeleteYear = () => {
		deleteTimeLine(yearToDelete, {
			onSettled: () => {
				setYearToDelete(null);
			},
		});
	};

	const handleSubmit = (data: timeLine) => {
		if (itemToEdit) {
			updateTimeLine(
				{
					timeLineData: data,
					year: itemToEdit.year,
				},
				{
					onSettled: () => {
						setItemToEdit(null);
					},
				},
			);
		} else {
			createTimeLine(data, {
				onSettled: () => {
					setCreateOpen(false);
				},
			});
		}
	};

	return (
		<div className="flex-grow container mx-auto px-4 py-8 min-h-[600px]">
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
						<BreadcrumbPage>История</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div>История</div>

			{!isLoading && !timeLineData?.length && (
				<div className={'mt-2'}>Нет данных</div>
			)}
			{!!timeLineData?.length && (
				<TimeLine
					timelineData={timeLineData}
					onEdit={setItemToEdit}
					onDelete={setYearToDelete}
				/>
			)}
			{isLoading && <FullPageLoader />}

			{isAdmin && (
				<>
					<ContextButton
						tooltip={'Создать'}
						iconVariant={ContextIcons.CREATE}
						onClick={() => {
							setCreateOpen(true);
						}}
						disabled={false}
					/>
					<UpdateTimeLineModal
						isLoading={createLoading || updateLoading}
						isOpen={createOpen || !!itemToEdit}
						onSubmit={handleSubmit}
						onClose={() => {
							setCreateOpen(false);
							setItemToEdit(null);
							setYearToDelete(null);
						}}
						timeLine={itemToEdit}
						isCreate={createOpen}
					/>
					<DeleteTimeLineModal
						onClose={() => {
							setYearToDelete(null);
						}}
						isOpen={!!yearToDelete}
						onConfirm={handleDeleteYear}
						isLoading={deleteLoading}
					/>
				</>
			)}
		</div>
	);
};

export default HistoryPage;
