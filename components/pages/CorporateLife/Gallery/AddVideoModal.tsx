'use client';

import type React from 'react';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, LinkIcon, Loader2 } from 'lucide-react';
import { useAddCompanyVideo } from '@/lib/api/queries/Content/mutations/video/useAddCompanyVideo';

interface AddVideoModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function AddVideoModal({ isOpen, onClose }: AddVideoModalProps) {
	const [title, setTitle] = useState('');
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const [videoLink, setVideoLink] = useState('');
	const [activeTab, setActiveTab] = useState('upload');

	const { mutate: addVideo, isPending } = useAddCompanyVideo();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setVideoFile(e.target.files[0]);
		}
	};

	const handleClose = () => {
		setTitle('');
		setVideoFile(null);
		setVideoLink('');
		setActiveTab('upload');
		onClose();
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData();
		if (!title.trim()) return;
		formData.append('title', title);

		if (activeTab === 'upload' && videoFile) {
			formData.append('file', videoFile);
		} else if (activeTab === 'link' && videoLink.trim()) {
			formData.append('link', videoLink);
		}

		addVideo(formData, {
			onSettled: () => {
				handleClose();
			},
		});
	};

	const isValid =
		title.trim() &&
		((activeTab === 'upload' && videoFile) ||
			(activeTab === 'link' && videoLink.trim()));

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Добавить видео</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="title">Название видео</Label>
						<Input
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Введите название видео"
							required
						/>
					</div>

					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="upload" className="flex items-center gap-2">
								<Upload className="w-4 h-4" />
								Загрузить файл
							</TabsTrigger>
							<TabsTrigger value="link" className="flex items-center gap-2">
								<LinkIcon className="w-4 h-4" />
								Добавить ссылку
							</TabsTrigger>
						</TabsList>

						<TabsContent value="upload" className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="video-file">Видеофайл</Label>
								{!videoFile ? (
									<div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
										<Upload className="h-8 w-8 text-muted-foreground mb-2" />
										<p className="text-sm text-muted-foreground mb-2">
											Перетащите видеофайл сюда или нажмите для выбора
										</p>
										<Input
											id="video-file"
											type="file"
											className="hidden"
											accept="video/*"
											onChange={handleFileChange}
										/>
										<Button
											type="button"
											variant="outline"
											onClick={() =>
												document.getElementById('video-file')?.click()
											}
										>
											Выбрать файл
										</Button>
									</div>
								) : (
									<div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
										<div className="flex-1 min-w-0">
											<p
												className="text-sm font-medium truncate"
												title={videoFile.name}
											>
												{videoFile.name}
											</p>
											<p className="text-xs text-muted-foreground">
												{(videoFile.size / 1024 / 1024).toFixed(2)} МБ
											</p>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => setVideoFile(null)}
											className="flex-shrink-0"
										>
											Удалить
										</Button>
									</div>
								)}
							</div>
						</TabsContent>

						<TabsContent value="link" className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="video-link">Ссылка на видео</Label>
								<Input
									id="video-link"
									type="url"
									value={videoLink}
									onChange={(e) => setVideoLink(e.target.value)}
									placeholder="https://www.youtube.com/watch?v=..."
								/>
								<p className="text-xs text-muted-foreground">
									Поддерживаются ссылки на YouTube, Vimeo и другие видеохостинги
								</p>
							</div>
						</TabsContent>
					</Tabs>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={handleClose}>
							Отмена
						</Button>
						<Button
							type="submit"
							disabled={!isValid || isPending}
							className="bg-red-600 hover:bg-red-700"
						>
							{isPending && <Loader2 className="animate-spin mr-2" />}
							Добавить видео
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
