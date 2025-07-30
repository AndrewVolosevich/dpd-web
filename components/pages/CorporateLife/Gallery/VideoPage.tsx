'use client';
import React, { useState } from 'react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Routes } from '@/const/routes';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Plus, Trash2, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { AddVideoModal } from '@/components/pages/CorporateLife/Gallery/AddVideoModal';
import useCompanyVideos from '@/lib/api/queries/Content/useCompanyVideos';
import { CompanyVideo } from '@/types/content';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { AlertDialog, AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import {
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteCompanyVideo } from '@/lib/api/queries/Content/mutations/video/useDeleteCompanyVideo';
import { cn } from '@/lib/utils';

const VideoPage = () => {
	const { isAdmin } = useAuth();
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [videoIdToDelete, setVideoIdToDelete] = useState<null | string>(null);
	const { data: videos } = useCompanyVideos();
	const { mutate: deleteVideo, isPending: deleteLoading } =
		useDeleteCompanyVideo();

	const getVideoThumbnail = (video: CompanyVideo) => {
		if (video.link && video.link.includes('youtube.com')) {
			// Извлекаем ID видео из YouTube ссылки
			const videoId = video.link.split('v=')[1]?.split('&')[0];
			return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
		}
		// Для локальных видео используем placeholder
		return '/images/dpd-image.jpg';
	};

	const handleDeleteVideo = () => {
		if (videoIdToDelete !== null) {
			deleteVideo(videoIdToDelete, {
				onSettled: () => setVideoIdToDelete(null),
			});
		}
	};

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
						<BreadcrumbLink href={`${Routes.CORPORATE_LIFE}/gallery`}>
							Галерея
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Все видео</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className={'flex items-center justify-between'}>
				<div>Все видео</div>
				{isAdmin && (
					<Button onClick={() => setIsAddModalOpen(true)} variant="default">
						<Plus className="w-4 h-4 mr-2" />
						Добавить видео
					</Button>
				)}
			</div>
			<div>
				{/* Video List */}
				<div className="max-w-6xl mx-auto px-6 py-12">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{videos?.map((video) => (
							<Card
								key={video.id}
								className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
							>
								<Link href={`/corporate-life/gallery/video/${video.id}`}>
									<div className="relative h-48 w-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
										{getVideoThumbnail(video) ? (
											<div
												className="absolute inset-0 bg-cover bg-center"
												style={{
													backgroundImage: `url(${getVideoThumbnail(video)})`,
												}}
											>
												<div className="absolute inset-0 bg-black/30"></div>
											</div>
										) : null}

										<div className="relative z-10 flex items-center justify-center">
											<div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
												<Play className="w-8 h-8 text-white ml-1" />
											</div>
										</div>

										{/* Video type indicator */}
										<div className="absolute top-3 right-3 z-10">
											<div className="px-2 py-1 bg-black/50 text-white text-xs rounded">
												{video.link ? 'YouTube' : 'Локальное'}
											</div>
										</div>
									</div>
								</Link>

								<CardContent className={cn('p-4 relative', isAdmin && 'pr-10')}>
									<h3 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
										{video.title}
									</h3>
									{isAdmin && (
										<Button
											variant="ghost"
											size="icon"
											className="absolute top-2 right-2 text-gray-400 hover:text-red-600 hover:bg-red-50"
											onClick={() => setVideoIdToDelete(video?.id || '')}
											disabled={deleteLoading}
										>
											<Trash2 className="w-5 h-5" />
										</Button>
									)}
								</CardContent>
							</Card>
						))}
					</div>

					{videos?.length === 0 && (
						<div className="text-center py-12">
							<VideoIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								Нет видео
							</h3>
							<p className="text-gray-500 mb-4">
								Добавьте первое видео в галерею
							</p>
							{isAdmin && (
								<Button
									onClick={() => setIsAddModalOpen(true)}
									className="bg-red-600 hover:bg-red-700"
								>
									<Plus className="w-4 h-4 mr-2" />
									Добавить видео
								</Button>
							)}
						</div>
					)}
				</div>

				{isAdmin && (
					<AddVideoModal
						isOpen={isAddModalOpen}
						onClose={() => setIsAddModalOpen(false)}
					/>
				)}
				{isAdmin && (
					<AlertDialog
						open={videoIdToDelete !== null}
						onOpenChange={() => setVideoIdToDelete(null)}
					>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Удалить видео?</AlertDialogTitle>
								<AlertDialogDescription>
									Вы уверены, что хотите удалить видео &#34;
									{videoIdToDelete !== null &&
										videos?.find((video) => video.id === videoIdToDelete)
											?.title}
									&#34;? Это действие нельзя отменить.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Отмена</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleDeleteVideo}
									disabled={deleteLoading}
									className="bg-red-600 hover:bg-red-700"
								>
									{deleteLoading && <Loader2 className="animate-spin mr-2" />}
									Удалить
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}
			</div>
		</div>
	);
};

export default VideoPage;
