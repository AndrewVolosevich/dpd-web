'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Download, Eye, Trash2 } from 'lucide-react';
import { MagazineModel } from '@/types/entities';
import Image from 'next/image';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import useApi from '@/hooks/useApi';

export function MagazineItem({ magazine }: { magazine: MagazineModel }) {
	const { isAdmin } = useAuth();
	const api = useApi();
	const queryClient = useQueryClient();

	const { mutate: deleteMagazine } = useMutation({
		mutationFn: async (magazineId: any) => {
			return api(`/content/magazines/${magazineId}`, {
				method: 'DELETE',
			});
		},
		onError: (error) => {
			toast({
				title: 'Неудачное удаление журнала',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['magazines'] });
			toast({
				title: 'Журнал успешно удален',
				variant: 'default',
			});
		},
	});

	const handleDownload = () => {
		// Create an anchor element and trigger download
		const link = document.createElement('a');
		link.href = magazine.contentUrl;
		link.download = `${magazine.title}.pdf`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="flex items-start gap-6 py-4 border-b last:border-b-0 flex-col md:flex-row relative">
			{isAdmin && (
				<Button
					className={'absolute right-0 top-4'}
					variant={'ghost'}
					onClick={() => deleteMagazine(magazine.id)}
				>
					<Trash2 className={'text-primary'} />
				</Button>
			)}
			<div className="relative w-[140px] h-[198px] bg-muted rounded-lg overflow-hidden">
				{magazine?.titleImg && (
					<Image
						src={magazine.titleImg}
						alt={`${magazine.title}`}
						layout="fill"
						objectFit="cover"
					/>
				)}
			</div>
			<div className="flex flex-col justify-between h-[198px] flex-1 w-full">
				<div>
					<h3 className="text-lg font-medium">{magazine.title}</h3>
					<p className="text-sm text-muted-foreground">
						Дата публикации:{' '}
						{format(magazine.createdAt, 'dd MMMM yyyy', { locale: ru })}
					</p>
				</div>
				<div className="flex gap-2 flex-row justify-end mt-4 md:mt-0">
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline" size="sm">
								<Eye className="h-4 w-4 mr-2" />
								Просмотр
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-[90vw] h-[90vh]">
							<DialogHeader>
								<DialogTitle>{magazine.title}</DialogTitle>
							</DialogHeader>
							<div className="flex-1 w-full h-[calc(90vh-6rem)]">
								<iframe
									src={magazine.contentUrl}
									className="w-full h-full rounded-md"
									title={`${magazine.title}`}
								/>
							</div>
						</DialogContent>
					</Dialog>
					<Button variant="outline" size="sm" onClick={handleDownload}>
						<Download className="h-4 w-4 mr-2" />
						Скачать PDF
					</Button>
				</div>
			</div>
		</div>
	);
}
