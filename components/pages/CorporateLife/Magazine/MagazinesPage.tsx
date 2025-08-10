'use client';
import React, { useState } from 'react';
import { MagazineItem } from '@/components/pages/CorporateLife/Magazine/MagazineItem';
import UploadMagazineModal from '@/components/pages/CorporateLife/Magazine/UploadMagazineModal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/global/AuthProvider';
import useMagazines from '@/lib/api/queries/Magazines/useMagazines';

const MagazinesPage = () => {
	const [open, setOpen] = useState(false);
	const { data } = useMagazines();
	const { isAdmin } = useAuth();

	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Корпоративные журналы</h1>

			{isAdmin && (
				<Button
					className={'mb-4'}
					type={'button'}
					onClick={() => setOpen(true)}
				>
					Загрузить журнал
				</Button>
			)}

			{!!data?.length && (
				<section className="bg-white rounded-lg shadow p-6 mb-6">
					<div className="divide-y">
						{data?.map((magazine) => (
							<MagazineItem key={magazine.id} magazine={magazine} />
						))}
					</div>
				</section>
			)}
			{isAdmin && (
				<UploadMagazineModal open={open} onClose={() => setOpen(false)} />
			)}
		</div>
	);
};

export default MagazinesPage;
