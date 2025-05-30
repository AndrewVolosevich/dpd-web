'use client';
import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Routes } from '@/const/routes';

interface OnboardingStep {
	id: string;
	title: string;
	description: string;
	href: string;
	illustration: React.ReactNode;
}

const steps: OnboardingStep[] = [
	{
		id: 'company-info',
		title: 'Изучи подробную информацию о компании',
		description: 'История, миссия, ценности и видео о компании',
		href: '/education/new-employee/company-info',
		illustration: (
			<div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100"></div>
				<div className="relative z-10 flex items-center space-x-2">
					<div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
						<div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
							<div className="w-4 h-4 bg-red-600 rounded-sm"></div>
						</div>
					</div>
					<div className="flex flex-col space-y-1">
						<div className="w-8 h-1 bg-red-500 rounded"></div>
						<div className="w-6 h-1 bg-gray-400 rounded"></div>
						<div className="w-10 h-1 bg-gray-400 rounded"></div>
					</div>
				</div>
			</div>
		),
	},
	{
		id: 'employee-directory',
		title: 'Ознакомься со структурой отделов в справочнике сотрудников',
		description: 'Изучение организационной структуры',
		href: `${Routes.ABOUT}/users`,
		illustration: (
			<div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100"></div>
				<div className="relative z-10 flex items-center space-x-3">
					<div className="flex flex-col items-center">
						<div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
							<div className="w-4 h-4 bg-white rounded-full"></div>
						</div>
						<div className="w-6 h-6 bg-gray-700 rounded-full mt-1"></div>
					</div>
					<div className="w-8 h-8 bg-red-600 rounded-lg"></div>
					<div className="flex flex-col items-center">
						<div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
							<div className="w-4 h-4 bg-white rounded-full"></div>
						</div>
						<div className="w-6 h-6 bg-red-500 rounded-full mt-1"></div>
					</div>
				</div>
			</div>
		),
	},
	{
		id: 'email-signature',
		title: 'Скачай шаблон автоподписи и настрой в своей почте',
		description: 'Настройка корпоративной подписи',
		href: '/education/new-employee/email-signature',
		illustration: (
			<div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100"></div>
				<div className="relative z-10 flex items-center space-x-2">
					<div className="w-16 h-12 bg-gray-800 rounded-sm flex items-center justify-center">
						<div className="w-12 h-8 bg-white rounded-sm flex flex-col justify-center px-1">
							<div className="h-1 bg-red-500 rounded mb-1"></div>
							<div className="h-0.5 bg-gray-300 rounded mb-0.5"></div>
							<div className="h-0.5 bg-gray-300 rounded mb-0.5"></div>
							<div className="h-0.5 bg-gray-300 rounded"></div>
						</div>
					</div>
					<div className="w-3 h-3 bg-green-500 rounded-full"></div>
				</div>
			</div>
		),
	},
	{
		id: 'portal-structure',
		title: 'Изучи структуру корпоративного портала',
		description: 'Инструкция по использованию портала',
		href: '/education/new-employee/portal-structure',
		illustration: (
			<div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100"></div>
				<div className="relative z-10 flex items-center space-x-2">
					<div className="w-14 h-10 bg-gray-800 rounded border-2 border-gray-600 flex flex-col">
						<div className="h-2 bg-red-500 rounded-t"></div>
						<div className="flex-1 bg-white p-1 flex flex-col space-y-0.5">
							<div className="h-0.5 bg-gray-300 rounded"></div>
							<div className="h-0.5 bg-gray-300 rounded"></div>
							<div className="h-0.5 bg-red-400 rounded"></div>
						</div>
					</div>
					<div className="flex flex-col space-y-1">
						<div className="w-2 h-2 bg-red-500 rounded-full"></div>
						<div className="w-2 h-2 bg-gray-400 rounded-full"></div>
						<div className="w-2 h-2 bg-gray-400 rounded-full"></div>
					</div>
				</div>
			</div>
		),
	},
	{
		id: 'corporate-ethics',
		title: 'Ознакомься с правилами корпоративной этики',
		description: 'Стиль управления, дресс-код, разрешение конфликтов',
		href: '/education/new-employee/corporate-ethics',
		illustration: (
			<div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100"></div>
				<div className="relative z-10 flex items-center space-x-2">
					<div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
						<div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
							<div className="w-3 h-3 bg-red-500 rounded-full"></div>
						</div>
					</div>
					<div className="flex flex-col space-y-1">
						<div className="w-8 h-1 bg-red-500 rounded"></div>
						<div className="w-6 h-1 bg-gray-400 rounded"></div>
						<div className="w-10 h-1 bg-gray-400 rounded"></div>
						<div className="w-4 h-1 bg-gray-400 rounded"></div>
					</div>
				</div>
			</div>
		),
	},
	{
		id: 'adaptation-plan',
		title:
			'Изучи план адаптации и/или стажировки в разделе Адаптация/База знаний',
		description: 'План адаптации и база знаний',
		href: `${Routes.EDUCATION}/adaptation`,
		illustration: (
			<div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100"></div>
				<div className="relative z-10 flex items-center space-x-2">
					<div className="w-12 h-10 bg-white border-2 border-red-500 rounded flex flex-col justify-center px-1">
						<div className="h-1 bg-red-500 rounded mb-1"></div>
						<div className="h-0.5 bg-gray-300 rounded mb-0.5"></div>
						<div className="h-0.5 bg-gray-300 rounded mb-0.5"></div>
						<div className="h-0.5 bg-gray-300 rounded"></div>
					</div>
					<div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
						<div className="w-4 h-4 bg-white rounded-full"></div>
					</div>
				</div>
			</div>
		),
	},
];

const NewEmployeePage = () => {
	return (
		<div className="w-full py-12">
			<div className="max-w-7xl mx-auto px-6">
				<h2 className="text-3xl font-light text-gray-600 mb-12 text-center">
					Начни с простого: полезные шаги для адаптации
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{steps.map((step) => (
						<Link key={step.id} href={step.href} className="group">
							<Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-0 shadow-sm">
								<CardContent className="p-6 text-center">
									<div className="mb-4">{step.illustration}</div>
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
