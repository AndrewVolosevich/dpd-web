'use client';

import React from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import useCompanyVideo from '@/lib/api/queries/Content/useCompanyVideo';

export default function VideoPlayerPage({ videoId }: { videoId: string }) {
	const { data: video, isLoading } = useCompanyVideo(videoId);

	const getYouTubeEmbedUrl = (url: string) => {
		const videoId = url.split('v=')[1]?.split('&')[0];
		return `https://www.youtube.com/embed/${videoId}`;
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Загрузка видео...</p>
				</div>
			</div>
		);
	}

	if (!video) {
		return (
			<div className="flex-grow container mx-auto px-4 py-8">
				<Breadcrumb>
					<BreadcrumbList className="p-0 list-none">
						<BreadcrumbItem>
							<BreadcrumbLink href="/public">Главная</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href={`${Routes.CORPORATE_LIFE}/magazines`}>
								Корпоративная жизнь
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href={`${Routes.CORPORATE_LIFE}/gallery`}>
								Галерея
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href={`${Routes.CORPORATE_LIFE}/gallery/video`}>
								Все видео
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Видео</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<div className="max-w-6xl mx-auto px-6 py-12 text-center">
					<p className="text-gray-600 mb-4">
						Запрашиваемое видео не существует или было удалено.
					</p>
					<Link href={`${Routes.CORPORATE_LIFE}/gallery/video`}>
						<Button className="bg-red-600 hover:bg-red-700">
							Вернуться к видеогалерее
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			{/* Video Player */}
			<Breadcrumb>
				<BreadcrumbList className="p-0 list-none">
					<BreadcrumbItem>
						<BreadcrumbLink href="/public">Главная</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href={`${Routes.CORPORATE_LIFE}/magazines`}>
							Корпоративная жизнь
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href={`${Routes.CORPORATE_LIFE}/gallery`}>
							Галерея
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href={`${Routes.CORPORATE_LIFE}/gallery/video`}>
							Все видео
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Видео</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="max-w-4xl mx-auto px-6 py-12">
				<Card className="overflow-hidden border-0 shadow-lg">
					<CardContent className="p-0">
						<div className="relative aspect-video bg-black">
							{video?.link ? (
								// YouTube или другое внешнее видео
								<iframe
									src={getYouTubeEmbedUrl(video?.link)}
									title={video.title}
									className="w-full h-full"
									allowFullScreen
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								/>
							) : video?.url ? (
								// Локальное видео
								<video
									controls
									className="w-full h-full"
									poster="/placeholder.svg"
								>
									<source src={video.url} type="video/mp4" />
									Ваш браузер не поддерживает воспроизведение видео.
								</video>
							) : (
								// Fallback если нет ни ссылки, ни URL
								<div className="w-full h-full flex items-center justify-center text-white">
									<div className="text-center">
										<Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
										<p>Видео недоступно</p>
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Video Info */}
				<div className="mt-8">
					<Card>
						<CardContent className="p-6">
							<h2 className="text-2xl font-bold mb-4">{video.title}</h2>
							<div className="space-y-2 text-sm text-gray-600">
								<p>
									<span className="font-medium">Тип:</span>{' '}
									{video?.link ? 'Внешнее видео (YouTube)' : 'Локальное видео'}
								</p>
								{video?.link && (
									<p>
										<span className="font-medium">Источник:</span>{' '}
										<a
											href={video?.link}
											target="_blank"
											rel="noopener noreferrer"
											className="text-red-600 hover:underline"
										>
											Открыть на YouTube
										</a>
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
