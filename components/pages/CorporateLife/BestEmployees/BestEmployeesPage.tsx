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
import useNominations from '@/lib/api/queries/Content/useNominations';
import NominationsList from '@/components/pages/CorporateLife/BestEmployees/NominationsList';
import FullPageLoader from '@/components/common/Loader/FullPageLoader';
import { CreateNominationModal } from '@/components/pages/CorporateLife/BestEmployees/CreateNominationModal';
import {
	CreateNominationDto,
	useCreateNomination,
} from '@/lib/api/queries/Content/mutations/nomination/useCreateNomination';

const BestEmployeesPage = () => {
	const { isAdmin } = useAuth();
	const [open, setOpen] = useState(false);
	const { data: nominations, isLoading: nominationsLoading } = useNominations();
	const { mutate: createNomination, isPending: createNominationLoading } =
		useCreateNomination();

	const handleCreateNomination = async (data: CreateNominationDto) => {
		createNomination(data, { onSettled: () => setOpen(false) });
	};

	if (nominationsLoading) {
		return <FullPageLoader />;
	}

	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			<Breadcrumb>
				<BreadcrumbList className="p-0 list-none">
					<BreadcrumbItem>
						<BreadcrumbLink href="/public">Главная</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href={`${Routes.CORPORATE_LIFE}/magazines`}>
							Корпоративная жизнь
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Лучшие Сотрудники</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className={'flex flex-row justify-between items-center mb-4'}>
				<div>Лучшие Сотрудники в номинациях</div>
				{isAdmin && (
					<Button variant={'outline'} onClick={() => setOpen(true)}>
						Добавить номинацию
						<Plus className={'h-4 w-4 ml-2'} />
					</Button>
				)}
			</div>

			{!!nominations?.length && <NominationsList nominations={nominations} />}

			{isAdmin && (
				<CreateNominationModal
					isOpen={open}
					onClose={() => setOpen(false)}
					onSave={handleCreateNomination}
					isLoading={createNominationLoading}
				/>
			)}
		</div>
	);
};

export default BestEmployeesPage;
