'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Camera, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Routes } from '@/const/routes';

const GalleryPage = () => {
	const galleryItems = [
		{
			id: 'photo',
			title: 'Фотогалерея',
			description:
				'Коллекция фотографий с мероприятий и повседневной жизни компании',
			href: `${Routes.CORPORATE_LIFE}/gallery/photo`,
			icon: <Camera className="w-6 h-6 text-white" />,
			imageSrc: '/images/gallery/photo.jpg',
			imageAlt: 'Фотогалерея',
		},
		{
			id: 'video',
			title: 'Видеогалерея',
			description: 'Видеоматериалы о компании, интервью и презентации',
			href: `${Routes.CORPORATE_LIFE}/gallery/video`,
			icon: <Video className="w-6 h-6 text-white" />,
			imageSrc: '/images/gallery/video.jpg',
			imageAlt: 'Видеогалерея',
		},
	];

	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			<Breadcrumb>
				<BreadcrumbList className="p-0 list-none">
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Главная</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href={`${Routes.CORPORATE_LIFE}/magazines`}>
							Корпоративная жизнь
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Галерея</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* Gallery Sections */}
			<div className="max-w-6xl mx-auto px-6 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{galleryItems.map((item) => (
						<Link key={item.id} href={item.href} className="group">
							<Card className="overflow-hidden border-0 shadow-md h-full transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
								<div className="relative h-64 w-full">
									<Image
										src={item.imageSrc || '/placeholder.svg'}
										alt={item.imageAlt}
										fill
										className="object-cover transition-transform duration-300 group-hover:scale-105"
										sizes="(max-width: 768px) 100vw, 50vw"
									/>
									<div className="absolute top-4 left-4 bg-red-600 rounded-full p-2">
										{item.icon}
									</div>
								</div>
								<CardContent className="p-6">
									<div className="flex justify-between items-center mb-2">
										<h2 className="text-2xl font-semibold">{item.title}</h2>
										<div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-red-500 group-hover:bg-red-50 transition-colors">
											<ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" />
										</div>
									</div>
									<p className="text-gray-600">{item.description}</p>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default GalleryPage;
