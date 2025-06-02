'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EDITOR_INITIAL_DATA } from '@/const/editor';
import { z } from 'zod';
import { NewsModel } from '@/types/entities';
import { Routes } from '@/const/routes';
import { cn } from '@/lib/utils';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import EditorBlock from '@/components/Editor/EditorBlock';
import { ContextButton, ContextIcons } from '@/components/ui/context-button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { useNonAdminRedirect } from '@/hooks/useNonAdminRedirect';
import { ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UploadNewsModal from '@/components/pages/News/UploadNewsModal';
import { useCreateNews } from '@/lib/api/queries/News/mutations/useCreateNews';
import { useUpdateNews } from '@/lib/api/queries/News/mutations/useUpdateNews';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
	title: z.string().max(120).min(1, 'Заголовок не может быть пустым'),
	description: z.string().max(200).optional(),
	content: z.any().optional(),
	isMain: z.boolean().optional(),
	isPublished: z.boolean().optional(),
});

interface EditNewsFormProps extends React.HTMLAttributes<HTMLDivElement> {
	news?: NewsModel;
}

const EditNewsForm = ({ news, className, ...props }: EditNewsFormProps) => {
	useNonAdminRedirect(`${Routes.CORPORATE_LIFE}/news`);
	const router = useRouter();
	const { isAdmin } = useAuth();
	const [clearCounter, setClearCounter] = useState<number>(0);
	const [editorData, setEditorData] = useState<any>(
		news?.content ? news?.content : EDITOR_INITIAL_DATA,
	);
	const [open, setOpen] = useState<boolean>(false);
	const [titleImgUrl, setTitleImgUrl] = useState<string>(news?.titleImg || '');

	const { mutateAsync: createNews, isPending: createLoading } = useCreateNews();
	const { mutateAsync: updateNews, isPending: updateLoading } = useUpdateNews();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		mode: 'onBlur',
		defaultValues: {
			title: news?.title ?? '',
			description: news?.description ?? '',
			content: news?.content ?? '',
			isMain: news?.isMain ?? false,
			isPublished: news?.isPublished ?? false,
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const content = editorData;
		let resp;
		if (news) {
			resp = await updateNews({
				...values,
				id: news.id,
				titleImg: titleImgUrl,
				content,
			});
		} else {
			resp = await createNews({
				...values,
				titleImg: titleImgUrl,
				content,
			});
		}
		const data = resp?.data;
		if (data?.id) {
			setTimeout(() => {
				router.push(`${Routes.CORPORATE_LIFE}/news/${data.id}`);
			}, 0);
		} else {
			setClearCounter((old) => old + 1);
			form.reset();
		}
	}

	const submitDisabled = !!form.formState.errors.title?.message;

	return (
		<div className={cn('grid gap-4', className)} {...props}>
			<Button
				variant={'ghost'}
				type={'button'}
				onClick={() => setOpen(true)}
				className={
					'h-auto justify-center justify-self-start cursor-pointer px-0 text-base text-primary'
				}
			>
				<ImagePlus className={'text-primary h-8 w-8 mr-2'} />
				Задать заглавное изображение
			</Button>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="grid gap-3">
						<div className="grid gap-1">
							<FormField
								control={form.control}
								name="isMain"
								render={({ field }) => {
									return (
										<FormItem className={'flex flex-row items-center'}>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className="leading-none ml-2 !mt-0">
												<FormLabel>
													Использовать в качестве главной новости
												</FormLabel>
											</div>
										</FormItem>
									);
								}}
							/>
						</div>
						<div className="grid gap-1">
							<FormField
								control={form.control}
								name="isPublished"
								render={({ field }) => {
									return (
										<FormItem className={'flex flex-row items-center'}>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className="leading-none ml-2 !mt-0">
												<FormLabel>Опубликовать</FormLabel>
											</div>
										</FormItem>
									);
								}}
							/>
						</div>
						<div className="grid gap-1">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel className={'sr-only'}>Title</FormLabel>
										<FormControl>
											<Input
												placeholder={'Заголовок'}
												maxLength={120}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-1">
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel className={'sr-only'}>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder={'Описание'}
												className="resize-none"
												maxLength={200}
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					</div>
					<EditorBlock
						className={'mt-4 w-full mx-auto'}
						data={editorData}
						clearCounter={clearCounter}
						onChange={setEditorData}
						editorBlockId="editorjs-container"
					/>
					{isAdmin && (
						<ContextButton
							type="submit"
							iconVariant={ContextIcons.SAVE}
							disabled={createLoading || updateLoading || submitDisabled}
							tooltip={news ? 'Сохранить' : 'Создать'}
						/>
					)}
				</form>
			</Form>
			<UploadNewsModal
				open={open}
				onClose={(val?: string) => {
					if (val) {
						setTitleImgUrl(val);
					}
					setOpen(false);
				}}
			/>
		</div>
	);
};

export default EditNewsForm;
