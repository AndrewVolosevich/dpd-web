'use client';
import React from 'react';
import useSurveysList from '@/lib/api/queries/Surveys/useSurveysList';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
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

const SurveysPage = () => {
	const { data } = useSurveysList();

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
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input placeholder="Поиск опроса..." className="pl-8" />
				</div>
				<Select defaultValue="newest">
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

			<Tabs defaultValue="all" className="w-full">
				<TabsList>
					<TabsTrigger value="all">Все</TabsTrigger>
					<TabsTrigger value="surveys">Опросы</TabsTrigger>
					<TabsTrigger value="tests">Тесты</TabsTrigger>
					<TabsTrigger value="drafts">Черновики</TabsTrigger>
					<TabsTrigger value="active">Активные</TabsTrigger>
					<TabsTrigger value="completed">Завершенные</TabsTrigger>
				</TabsList>
			</Tabs>

			<SurveysList surveys={data} />
		</div>
	);
};

export default SurveysPage;
