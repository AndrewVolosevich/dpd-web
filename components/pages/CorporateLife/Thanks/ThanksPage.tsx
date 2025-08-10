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
import { ThanksCard } from '@/components/pages/CorporateLife/Thanks/ThanksCard';
import { CreateThanksModal } from '@/components/pages/CorporateLife/Thanks/CreateThanksModal';
import { EditThanksModal } from '@/components/pages/CorporateLife/Thanks/EditThanksModal';
import { DeleteThanksModal } from '@/components/pages/CorporateLife/Thanks/DeleteThanksModal';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { ThanksTo } from '@/types/content';
import useThanksTo from '@/lib/api/queries/Content/mutations/thanks-to/useThanksTo';

const ThanksPage = () => {
	const { isAdmin } = useAuth();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [editingThanks, setEditingThanks] = useState<ThanksTo | null>(null);
	const [deletingThanks, setDeletingThanks] = useState<ThanksTo | null>(null);

	const { data: thanksToData } = useThanksTo();

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
						<BreadcrumbPage>Спасибо</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div>
				<section className="bg-white rounded-lg shadow p-6 mb-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold">Спасибо</h2>
						{isAdmin && (
							<Button onClick={() => setIsCreateModalOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Добавить благодарность
							</Button>
						)}
					</div>

					{thanksToData?.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<p>Пока нет благодарностей</p>
							<Button
								variant="outline"
								className="mt-4 bg-transparent"
								onClick={() => setIsCreateModalOpen(true)}
							>
								Добавить первую благодарность
							</Button>
						</div>
					) : (
						<div className="grid grid-cols-1 gap-6">
							{thanksToData?.map((thanks) => (
								<ThanksCard
									key={thanks.id}
									thanks={thanks}
									onEdit={() => setEditingThanks(thanks)}
									onDelete={() => setDeletingThanks(thanks)}
								/>
							))}
						</div>
					)}

					{isAdmin && (
						<CreateThanksModal
							isOpen={isCreateModalOpen}
							onClose={() => setIsCreateModalOpen(false)}
						/>
					)}

					{isAdmin && editingThanks && (
						<EditThanksModal
							isOpen={true}
							onClose={() => setEditingThanks(null)}
							thanks={editingThanks}
						/>
					)}

					{isAdmin && deletingThanks && (
						<DeleteThanksModal
							isOpen={true}
							onClose={() => setDeletingThanks(null)}
							thanks={deletingThanks}
						/>
					)}
				</section>
			</div>
		</div>
	);
};

export default ThanksPage;
