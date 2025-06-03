'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Routes } from '@/const/routes';

interface OnboardingStep {
	id: string;
	title: string;
	description: string;
	href: string;
	imageSrc: string;
	imageAlt: string;
}

const steps: OnboardingStep[] = [
	{
		id: 'company-info',
		title: 'Изучи подробную информацию о компании',
		description: 'История, миссия, ценности и видео о компании',
		href: '/education/new-employee/company-info',
		imageSrc: '/images/new-employee/company-info.jpg',
		imageAlt: 'Изучи подробную информацию о компании',
	},
	{
		id: 'employee-directory',
		title: 'Ознакомься со структурой отделов в справочнике сотрудников',
		description: 'Изучение организационной структуры',
		href: `${Routes.ABOUT}/users`,
		imageSrc: '/images/new-employee/employee-directory.jpg',
		imageAlt: 'Ознакомься со структурой отделов в справочнике сотрудников',
	},
	{
		id: 'email-signature',
		title: 'Скачай шаблон автоподписи и настрой в своей почте',
		description: 'Настройка корпоративной подписи',
		href: '/education/new-employee/email-signature',
		imageSrc: '/images/new-employee/email-signature.jpg',
		imageAlt: 'Скачай шаблон автоподписи и настрой в своей почте',
	},
	{
		id: 'portal-structure',
		title: 'Изучи структуру корпоративного портала',
		description: 'Инструкция по использованию портала',
		href: '/education/new-employee/portal-structure',
		imageSrc: '/images/new-employee/portal-structure.jpg',
		imageAlt: 'Изучи структуру корпоративного портала',
	},
	{
		id: 'corporate-ethics',
		title: 'Ознакомься с правилами корпоративной этики',
		description: 'Стиль управления, дресс-код, разрешение конфликтов',
		href: '/education/new-employee/corporate-ethics',
		imageSrc: '/images/new-employee/corporate-ethics.jpg',
		imageAlt: 'Ознакомься с правилами корпоративной этики',
	},
	{
		id: 'adaptation-plan',
		title:
			'Изучи план адаптации и/или стажировки в разделе Адаптация/База знаний',
		description: 'План адаптации и база знаний',
		href: `${Routes.EDUCATION}/adaptation`,
		imageSrc: '/images/new-employee/adaptation-plan.jpg',
		imageAlt:
			'Изучи план адаптации и/или стажировки в разделе Адаптация/База знаний',
	},
];

const NewEmployeePage = () => {
	return (
		<div className="w-full py-12">
			<div className="max-w-7xl mx-auto px-6">
				<div>
					<h2 className="text-3xl font-light text-gray-600 text-center">
						Добро пожаловать в команду DPD!
					</h2>
					<div className={'text-md my-8 text-center'}>
						На этой странице мы собрали полезную информацию, чтобы тебе было
						легче погрузиться в новую среду. Сегодня DPD в Беларуси — одна из
						ведущих транспортно-экспедиционных компаний в стране по
						экспресс-доставке посылок и грузов, которая осуществляет свою
						деятельность с 2011 года. Мы гордимся своей историей и рады, что вы
						стали частью нашей команды!
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{steps.map((step) => (
						<Link key={step.id} href={step.href} className="group">
							<Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-0 shadow-sm">
								<CardContent className="p-6 text-center">
									<div className="mb-4 relative h-48 w-full">
										<Image
											src={step.imageSrc || '/placeholder.svg'}
											alt={step.imageAlt}
											fill
											className={`rounded-lg ${
												step.id === 'employee-directory' ||
												step.id === 'adaptation-plan'
													? 'object-contain'
													: 'object-cover'
											}`}
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										/>
									</div>
									<p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-800 transition-colors">
										{step.title}
									</p>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default NewEmployeePage;
