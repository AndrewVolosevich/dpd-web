import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import useApi from '@/hooks/useApi';

interface UploadNewsImageProps {
	onClose: (val?: string) => void;
}

const UploadNewsImage = ({ onClose }: UploadNewsImageProps) => {
	const [preview, setPreview] = useState<string | null>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const api = useApi();
	const { mutate: updatePhoto, isPending: updateLoading } = useMutation({
		mutationFn: async (userData: any) => {
			const resp = await api.post(`/upload/update-news-image`, userData);
			return resp?.data;
		},
		onError: (error) => {
			onClose();
			toast({
				title: 'Неудачное изменение изображения',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: async (r) => {
			formRef.current?.reset();
			setPreview(null);
			if (fileInputRef.current) fileInputRef.current.value = '';
			if (r?.url) {
				onClose(r?.url);

				toast({
					title: 'Изображение успешно изменено',
					variant: 'default',
				});
			}
		},
	});

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		await updatePhoto(formData);
	};

	return (
		<div className={'mt-4'}>
			<form onSubmit={handleSubmit} className="space-y-4" ref={formRef}>
				<div className="flex items-center justify-center">
					{preview ? (
						<div className="relative w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
							<Image
								src={preview || '/placeholder.svg'}
								alt="Preview"
								fill
								className="object-cover"
							/>
						</div>
					) : (
						<div className="w-full aspect-[16/9] bg-gray-100 rounded-lg flex items-center justify-center">
							<span className="text-gray-500">Нет изображения</span>
						</div>
					)}
				</div>
				<div>
					<label
						htmlFor="avatar"
						className="block text-sm font-medium text-gray-700"
					>
						Выберите изображение
					</label>
					<input
						type="file"
						id="avatar"
						name="file"
						accept="image/*"
						onChange={handleFileChange}
						ref={fileInputRef}
						className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-[hsl(346,100%,95%)] file:text-[hsl(346,100%,43%)]
                       hover:file:bg-[hsl(346,100%,90%)]"
					/>
				</div>
				<Button
					type="submit"
					disabled={!preview || updateLoading}
					className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[hsl(346,100%,43%)] hover:bg-[hsl(346,100%,38%)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[hsl(346,100%,43%)] disabled:opacity-50"
				>
					{updateLoading ? 'Загрузка...' : 'Загрузить изображение'}
				</Button>
			</form>
		</div>
	);
};

export default UploadNewsImage;
