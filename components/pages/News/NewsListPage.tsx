'use client';

import React, { useState } from 'react';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { useRouter } from 'next/navigation';
import { Routes } from '@/const/routes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from '@/hooks/useApi';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { NewsModel } from '@/types/entities';
import useNewsList from '@/lib/api/queries/News/useNewsList';
import FullPageLoader from '@/components/common/Loader/FullPageLoader';

const limit = 4;

const NewsListPage = () => {
	const { isAdmin } = useAuth();
	const api = useApi();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);

	const { data, isLoading } = useNewsList({ page, limit });

	const { mutate: deleteNews } = useMutation({
		mutationFn: async (newsId: any) => {
			return api(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/news/${newsId}`, {
				method: 'DELETE',
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление новости',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['news', 'news-list'] });
			toast({
				title: 'Новость успешно удалена',
				variant: 'default',
			});
		},
	});

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

	const getContent = () => {
		if (isLoading) {
			return <FullPageLoader />;
		}
		return (
			<>
				<div className="space-y-6">
					{data?.data &&
						data?.data?.map((item: NewsModel) => {
							return (
								<article
									key={item.id}
									className="bg-white rounded-lg shadow overflow-hidden"
								>
									<div className="md:flex">
										<div className="md:flex-shrink-0">
											<img
												className="w-full h-full object-cover md:w-48 "
												src={'/images/dpd-image.jpg'}
												alt={item?.title}
											/>
										</div>
										<div className="p-8 w-full relative">
											{isAdmin && (
												<Button
													className={'absolute right-4 top-4'}
													variant={'ghost'}
													onClick={() => deleteNews(item.id)}
												>
													<Trash2 className={'text-primary'} />
												</Button>
											)}
											<div className="uppercase tracking-wide text-sm font-semibold">
												{format(new Date(item?.createdAt), 'dd.MM.yyyy')}
											</div>
											<h4 className="block mt-1 text-lg leading-tight font-medium text-black text-primary">
												{item?.title}
											</h4>
											<p className="mt-2 text-gray-500">{item?.description}</p>
											<Button
												className="mt-4"
												variant="buttonLink"
												size="sm"
												href={`${Routes.NEWS}/${item.id}`}
											>
												Читать далее
											</Button>
										</div>
									</div>
								</article>
							);
						})}
				</div>

				{data?.data && (
					<Pagination className="mt-8">
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious disabled={page <= 1} onClick={handlePrev} />
							</PaginationItem>
							<PaginationItem>
								<PaginationLink href="#">{page}</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationNext
									disabled={page >= data?.total / limit}
									onClick={handleNext}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				)}
			</>
		);
	};

	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			<div className={'flex flex-row justify-between items-start'}>
				<h1 className="text-2xl font-bold mb-6">Новости компании</h1>

				{isAdmin && (
					<Button
						onClick={() => {
							router.push(`${Routes.NEWS}/create`);
						}}
						type={'button'}
					>
						Создать новость
					</Button>
				)}
			</div>
			{getContent()}
		</div>
	);
};

export { NewsListPage };
