'use client';
import React from 'react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Routes } from '@/const/routes';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const CareerPage = () => {
	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			<Breadcrumb>
				<BreadcrumbList className="p-0 list-none">
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Главная</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href={`${Routes.ABOUT}/history`}>
							О компании
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Карьера в DPD</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div>Карьера в DPD</div>

			<div className="min-h-screen py-12">
				<div className="max-w-6xl mx-auto px-6">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Вакансии */}
						<Link href={`${Routes.ABOUT}/career/vacancy`} className="group">
							<div className="bg-primary hover:brightness-90 transition-colors duration-200 rounded-2xl p-8 h-48 flex flex-col justify-between text-white">
								<h2 className="text-2xl font-semibold">Вакансии</h2>
								<div className="flex items-center gap-2 text-white/90 group-hover:text-white">
									<div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
										<ArrowUpRight className="w-4 h-4" />
									</div>
									<span>Узнать больше</span>
								</div>
							</div>
						</Link>

						{/* Конкурсы на вакансии */}
						<Link href={`${Routes.ABOUT}/career/contest`} className="group">
							<div className="bg-midGrey hover:brightness-90 transition-colors duration-200 rounded-2xl p-8 h-48 flex flex-col justify-between text-white">
								<h2 className="text-2xl font-semibold">Конкурсы на вакансии</h2>
								<div className="flex items-center gap-2 text-white/90 group-hover:text-white">
									<div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
										<ArrowUpRight className="w-4 h-4" />
									</div>
									<span>Узнать больше</span>
								</div>
							</div>
						</Link>

						{/* Акция - Приведи друга */}
						<Link href={`${Routes.ABOUT}/career/promotion`} className="group">
							<div className="bg-warmGrey hover:brightness-90 transition-colors duration-200 rounded-2xl p-8 h-48 flex flex-col justify-between text-white">
								<h2 className="text-2xl font-semibold">
									Акция - Приведи друга
								</h2>
								<div className="flex items-center gap-2 text-white/90 group-hover:text-white">
									<div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
										<ArrowUpRight className="w-4 h-4" />
									</div>
									<span>Узнать больше</span>
								</div>
							</div>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CareerPage;
