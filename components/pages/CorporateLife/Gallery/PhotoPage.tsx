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
import {
	ChevronLeft,
	ChevronRight,
	Loader2,
	Plus,
	Trash2,
	X,
} from 'lucide-react';
import { useAuth } from '@/components/providers/global/AuthProvider';
import UploadPhotosModal from '@/components/pages/CorporateLife/Gallery/UploadPhotosModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';
import useEventPhoto from '@/lib/api/queries/Content/useEventPhoto';
import { EventPhoto } from '@/types/content';
import { useDeleteEventPhoto } from '@/lib/api/queries/Content/mutations/photo/useDeleteEventPhoto';
import { AlertDialog, AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import {
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const PhotoPage = () => {
	const [open, setOpen] = useState(false);
	const { isAdmin } = useAuth();
	const { data: photos } = useEventPhoto();
	const { mutate: deletePhoto, isPending: deleteLoading } =
		useDeleteEventPhoto();
	const [selectedSection, setSelectedSection] = useState<EventPhoto | null>(
		null,
	);
	const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isCarouselOpen, setIsCarouselOpen] = useState(false);

	const openCarousel = (section: EventPhoto, imageIndex = 0) => {
		setSelectedSection(section);
		setCurrentImageIndex(imageIndex);
		setIsCarouselOpen(true);
	};

	const closeCarousel = () => {
		setIsCarouselOpen(false);
		setSelectedSection(null);
		setCurrentImageIndex(0);
	};

	const nextImage = () => {
		if (
			selectedSection &&
			currentImageIndex < selectedSection.urls.length - 1
		) {
			setCurrentImageIndex(currentImageIndex + 1);
		}
	};

	const prevImage = () => {
		if (currentImageIndex > 0) {
			setCurrentImageIndex(currentImageIndex - 1);
		}
	};

	const goToImage = (index: number) => {
		setCurrentImageIndex(index);
	};

	const confirmDeleteSection = (id: string) => {
		setSectionToDelete(id);
	};

	const deleteSection = () => {
		if (sectionToDelete !== null) {
			deletePhoto(sectionToDelete, {
				onSettled: () => {
					setSectionToDelete(null);
				},
			});
		}
	};

	const cancelDelete = () => {
		setSectionToDelete(null);
	};

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
						<BreadcrumbPage>Фото</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className={'flex items-center justify-between'}>
				<div>Фото</div>
				{isAdmin && (
					<>
						<Button variant={'outline'} onClick={() => setOpen(true)}>
							Добавить фото альбом
							<Plus className={'h-4 w-4 ml-2'} />
						</Button>
						<UploadPhotosModal isOpen={open} onClose={() => setOpen(false)} />
					</>
				)}
			</div>
			<div className="max-w-6xl mx-auto px-6 py-12">
				<div className="space-y-12">
					{photos?.map((section, sectionIndex) => (
						<Card key={sectionIndex} className="border-0 shadow-md relative">
							<CardHeader>
								<CardTitle className="text-xl">{section.title}</CardTitle>
								<p className="text-gray-600">
									{section.urls.length} фотографий
								</p>
								{isAdmin && (
									<Button
										variant="ghost"
										size="icon"
										className="absolute top-4 right-4 text-gray-400 hover:text-red-600 hover:bg-red-50"
										onClick={() => confirmDeleteSection(section?.id || '')}
									>
										<Trash2 className="w-5 h-5" />
									</Button>
								)}
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
									{section.urls.map((url, imageIndex) => (
										<div
											key={imageIndex}
											className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
											onClick={() => openCarousel(section, imageIndex)}
										>
											<Image
												src={url || '/placeholder.svg'}
												alt={`${section.title} - фото ${imageIndex + 1}`}
												fill
												className="object-cover transition-transform duration-300 group-hover:scale-110"
												sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
											/>
											<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
										</div>
									))}
								</div>
								{/*{section.urls.length >= 2 && (*/}
								{/*	<div className="mt-4 text-center">*/}
								{/*		<Button*/}
								{/*			variant="outline"*/}
								{/*			onClick={() => openCarousel(section, 0)}*/}
								{/*			className="border-red-600 text-red-600 hover:bg-red-50"*/}
								{/*		>*/}
								{/*			Посмотреть все {section.urls.length} фото*/}
								{/*		</Button>*/}
								{/*	</div>*/}
								{/*)}*/}
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Carousel Modal */}
			<Dialog open={isCarouselOpen} onOpenChange={closeCarousel}>
				<DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-black">
					<div className="relative w-full h-full flex flex-col">
						{/* Header */}
						<div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
							<div className="flex justify-between items-center text-white">
								<div>
									<h3 className="text-lg font-semibold">
										{selectedSection?.title}
									</h3>
									<p className="text-sm text-white/80">
										{currentImageIndex + 1} из {selectedSection?.urls.length}
									</p>
								</div>
								<Button
									variant="ghost"
									size="icon"
									onClick={closeCarousel}
									className="text-white hover:bg-white/20"
								>
									<X className="w-6 h-6" />
								</Button>
							</div>
						</div>

						{/* Main Image */}
						<div className="flex-1 relative">
							{selectedSection && (
								<Image
									src={
										selectedSection.urls[currentImageIndex] ||
										'/placeholder.svg'
									}
									alt={`${selectedSection.title} - фото ${currentImageIndex + 1}`}
									fill
									className="object-contain"
									sizes="100vw"
								/>
							)}

							{/* Navigation Arrows */}
							{selectedSection && selectedSection.urls.length > 1 && (
								<>
									<Button
										variant="ghost"
										size="icon"
										className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 disabled:opacity-30"
										onClick={prevImage}
										disabled={currentImageIndex === 0}
									>
										<ChevronLeft className="w-8 h-8" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 disabled:opacity-30"
										onClick={nextImage}
										disabled={
											currentImageIndex ===
											(selectedSection?.urls.length || 0) - 1
										}
									>
										<ChevronRight className="w-8 h-8" />
									</Button>
								</>
							)}
						</div>

						{/* Thumbnail Navigation */}
						{selectedSection && selectedSection.urls.length > 1 && (
							<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
								<div className="flex justify-center gap-2 overflow-x-auto">
									{selectedSection.urls.map((url, index) => (
										<button
											key={index}
											className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
												index === currentImageIndex
													? 'border-white'
													: 'border-transparent'
											}`}
											onClick={() => goToImage(index)}
										>
											<Image
												src={url || '/placeholder.svg'}
												alt={`Миниатюра ${index + 1}`}
												fill
												className="object-cover"
												sizes="64px"
											/>
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
			{/* Delete Confirmation Dialog */}
			{isAdmin && (
				<AlertDialog
					open={sectionToDelete !== null}
					onOpenChange={cancelDelete}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Удалить раздел?</AlertDialogTitle>
							<AlertDialogDescription>
								Вы уверены, что хотите удалить раздел &#34;
								{sectionToDelete !== null &&
									photos?.find((photo) => photo.id === sectionToDelete)?.title}
								&#34;? Это действие нельзя отменить.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Отмена</AlertDialogCancel>
							<AlertDialogAction
								onClick={deleteSection}
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
	);
};

export default PhotoPage;
