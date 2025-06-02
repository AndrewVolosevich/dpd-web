'use client';
import React from 'react';
import { Routes } from '@/const/routes';
import { ContextButton, ContextIcons } from '@/components/ui/context-button';
import NewsInfo from '@/components/pages/News/NewsInfo';
import { useQuery } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/global/AuthProvider';
import EditNewsForm from '@/components/pages/News/EditNewsForm';
import FullPageLoader from '@/components/common/Loader/FullPageLoader';

const containerClasses = 'container mx-auto p-4 h-full';
const headerClasses = 'text-2xl font-bold mb-4';

const NewsPage = ({
	newsId,
	isEdit,
}: {
	newsId?: string;
	isEdit?: boolean;
}) => {
	const api = useApi();
	const { isAdmin } = useAuth();
	const router = useRouter();
	const { data, isLoading } = useQuery({
		queryKey: ['news', { newsId }],
		enabled: !!newsId,
		queryFn: async () => {
			const resp = await api.get(`/news/${newsId}`);

			return await resp?.data;
		},
	});

	const handleEdit = () => {
		router.push(`${Routes.CORPORATE_LIFE}/news/edit/${newsId}`);
	};

	if (!newsId) {
		return (
			<div className={containerClasses}>
				<h2 className={headerClasses}>Создать новость</h2>
				<EditNewsForm />
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className={containerClasses}>
				<FullPageLoader />
			</div>
		);
	}

	if (newsId && !data && !isLoading) {
		return (
			<div className={containerClasses}>
				<h2 className={headerClasses}>Такой новости не существует</h2>
			</div>
		);
	}

	if (isEdit && data && !isLoading && isAdmin) {
		return (
			<div className={containerClasses}>
				<h2 className={headerClasses}>Редактировать новость</h2>
				<EditNewsForm news={data} />
			</div>
		);
	}

	return (
		<div className={containerClasses}>
			<div className={'flex flex-col'}>
				<h2 className={headerClasses}>{'Новость'}</h2>
				{/*<div className="relative w-full aspect-[16/4] bg-gray-100 rounded-lg overflow-hidden mb-4">*/}
				{/*	<Image*/}
				{/*		src={data?.titleImg || '/placeholder.svg'}*/}
				{/*		alt="Preview"*/}
				{/*		fill*/}
				{/*		className="object-cover"*/}
				{/*	/>*/}
				{/*</div>*/}
				{isAdmin && (
					<ContextButton
						tooltip={'Изменить'}
						iconVariant={ContextIcons.EDIT}
						onClick={handleEdit}
					/>
				)}
			</div>
			{data && <NewsInfo news={data} />}
		</div>
	);
};

export default NewsPage;
