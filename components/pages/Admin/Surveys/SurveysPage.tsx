'use client';
import React, { useState } from 'react';
import useSurveysList from '@/lib/api/queries/Education/useSurveysList';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SurveysList } from '@/components/pages/Admin/Surveys/SurveysList';
import Link from 'next/link';
import { Routes } from '@/const/routes';
import { useDebounce } from '@/hooks/useDebounce';
import Search from '@/components/common/Search/Search';

const SurveysPage = () => {
	const [sort, setSort] = React.useState<string>('newest');
	const [surveyType, setSurveyType] = React.useState<string>('ALL');
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search, 1000);

	const { data } = useSurveysList({
		sort,
		search: debouncedSearch,
		status: surveyType,
	});

	return (
		<div className="container py-6 space-y-6 m-auto">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Опросы и тесты</h1>
				<Button asChild className="bg-primary">
					<Link href={`${Routes.ADMIN}/surveys/create`}>
						<PlusCircle className="mr-2 h-4 w-4" />
						Создать опрос
					</Link>
				</Button>
			</div>

			<div className="flex gap-4 items-center">
				<div className="relative flex-1">
					<Search
						searchState={[search, setSearch]}
						placeholder={'Поиск опроса...'}
					/>
				</div>
				<Select value={sort} onValueChange={(value) => setSort(value)}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Сортировка" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="newest">Сначала новые</SelectItem>
						<SelectItem value="oldest">Сначала старые</SelectItem>
						<SelectItem value="az">А-Я</SelectItem>
						<SelectItem value="za">Я-А</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<Tabs
				value={surveyType}
				onValueChange={(value) => setSurveyType(value)}
				className="w-full"
			>
				<TabsList>
					<TabsTrigger value="ALL">Все</TabsTrigger>
					{/*Todo: implement after adding test*/}
					{/*<TabsTrigger value="surveys">Опросы</TabsTrigger>*/}
					{/*<TabsTrigger value="tests">Тесты</TabsTrigger>*/}
					<TabsTrigger value="DRAFT">Черновики</TabsTrigger>
					<TabsTrigger value="ACTIVE">Активные</TabsTrigger>
					<TabsTrigger value="COMPLETED">Завершенные</TabsTrigger>
				</TabsList>
			</Tabs>

			{!!data?.length && <SurveysList surveys={data} />}
		</div>
	);
};

export default SurveysPage;
