'use client';

import React, { useMemo, useState } from 'react';
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
import { endOfDay, format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { NewsModel } from '@/types/entities';
import useNewsList from '@/lib/api/queries/News/useNewsList';
import FullPageLoader from '@/components/common/Loader/FullPageLoader';
import { DateRangePicker } from '@/components/common/DateRangePicker/DateRangePicker';
import { DateRange } from 'react-day-picker';
import Search from '@/components/common/Search/Search';
import { useDebounce } from '@/hooks/useDebounce';
import { useDeleteNews } from '@/lib/api/queries/News/mutations/useDeleteNews';

const limit = 10;

const NewsListPage = () => {
	const { isAdmin } = useAuth();
	const router = useRouter();
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search, 1000);
	const [page, setPage] = useState(1);

	const state = useState<DateRange | undefined>({
		from: new Date(2025, 0, 1),
		to: endOfDay(new Date()),
	});
	const dateRange = { from: state[0]?.from, to: state[0]?.to };
	const { data, isLoading } = useNewsList({
		page,
		limit,
		dateRange,
		search: debouncedSearch,
	});
	const { mutate: deleteNews } = useDeleteNews();

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

	const newsToShow = useMemo((): NewsModel[] => {
		if (!data) return [];
		const { data: newsList, main } = data;
		return [...(newsList || []), ...(main ? [main] : [])];
	}, [data]);

	const getContent = () => {
		if (isLoading) {
			return <FullPageLoader />;
		}
		return (
			<>
				<div className="space-y-6">
					{newsToShow &&
						newsToShow?.map((item: NewsModel) => {
							return (
								<article
									key={item.id}
									className="bg-white rounded-lg shadow overflow-hidden"
								>
									<div className="md:flex">
										<div className="md:flex-shrink-0">
											<img
												className="w-full h-full object-cover md:w-48 "
												src={item?.titleImg || '/images/dpd-image.jpg'}
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
			<div className={'flex flex-col justify-between items-start'}>
				<div className="flex flex-row w-full justify-between">
					<h1 className="text-2xl font-bold">Новости компании</h1>

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
				<div
					className={'flex flex-col md:flex-row w-full justify-between my-4'}
				>
					<Search
						searchState={[search, setSearch]}
						className={'mb-2 md:mb-0'}
					/>
					<DateRangePicker state={state} />
				</div>
			</div>
			{getContent()}
		</div>
	);
};

export { NewsListPage };
