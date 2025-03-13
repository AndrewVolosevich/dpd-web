'use client';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import useSurveysList from '@/lib/api/queries/Surveys/useSurveysList';
import { Routes } from '@/const/routes';
import { format } from 'date-fns';

const ActiveSurveys = () => {
	const { data } = useSurveysList({ status: 'ACTIVE', unpassedOnly: 'true' });

	if (!data?.length) {
		return null;
	}

	return (
		<section className="w-full mt-4 container mx-auto">
			<div className="container">
				<h2 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base ml-2">
					Доступные опросы
				</h2>
				<div className="flex flex-row w-full flex-wrap gap-4">
					{data?.map((survey) => (
						<Card
							key={survey.id}
							className="border shadow-sm hover:shadow-md transition-shadow w-[49%]"
						>
							<CardHeader className="pb-2">
								<CardTitle className="text-xl font-bold text-red-600">
									{survey.title}
								</CardTitle>
							</CardHeader>
							<CardContent className="pb-2">
								{/*<p className="text-gray-600">{survey.description}</p>*/}
								<div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
									{survey?.endDate && (
										<p className="text-sm text-gray-500">
											<span className="font-medium">Дата завершения:</span>{' '}
											{format(new Date(survey?.endDate), 'dd.MM.yyyy')}
										</p>
									)}
									<p className="text-sm text-gray-500">
										<span className="font-medium">Вопросов:</span>{' '}
										{survey.questions?.length}
									</p>
									<p className="text-sm text-gray-500">
										<span className="font-medium">Прошли опрос:</span>{' '}
										{survey?._count?.responses}
									</p>
								</div>
							</CardContent>
							<CardFooter className="flex justify-end">
								<Link href={`${Routes.ADMIN}/surveys/${survey?.id}/take`}>
									<Button
										className="bg-primary hover:bg-red-700 text-white"
										variant="default"
										size="sm"
									>
										Пройти опрос
										<ChevronRight className="ml-2 h-4 w-4" />
									</Button>
								</Link>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

export default ActiveSurveys;
