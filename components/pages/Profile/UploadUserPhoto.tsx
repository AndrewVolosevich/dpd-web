import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import useApi from '@/hooks/useApi';
import { UserData } from '@/types/entities';
import { useAuth } from '@/components/providers/global/AuthProvider';

interface EditUserPhotoProps {
	user?: UserData;
	isSelf?: boolean;
	onClose: () => void;
}

const UploadUserPhoto = ({ user, isSelf, onClose }: EditUserPhotoProps) => {
	const [preview, setPreview] = useState<string | null>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { updateUser: updateSelfUser } = useAuth();

	const queryClient = useQueryClient();
	const api = useApi();
	const { mutate: updatePhoto, isPending: updateLoading } = useMutation({
		mutationFn: async (userData: any) => {
			const resp = await api.post(`/upload/update-photo`, userData);
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачное изменение фото',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: async (u) => {
			if (isSelf) {
				updateSelfUser(u);
			}
			// Reset the form and preview
			formRef.current?.reset();
			setPreview(null);
			if (fileInputRef.current) fileInputRef.current.value = '';

			await queryClient.invalidateQueries({
				queryKey: ['another-user'],
			});
			await queryClient.invalidateQueries({
				queryKey: ['new-users'],
			});
			await queryClient.invalidateQueries({
				queryKey: ['paginated-users'],
			});
			await queryClient.invalidateQueries({
				queryKey: ['users-by-birthdays'],
			});

			toast({
				title: 'Фото успешно изменено',
				variant: 'default',
			});
		},
		onSettled: () => {
			onClose();
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
		if (user) {
			formData.append('userId', user?.id);
			formData.append('userTel', user?.tel);
		}
		await updatePhoto(formData);
	};

	return (
		<div className={'mt-4'}>
			<form onSubmit={handleSubmit} className="space-y-4" ref={formRef}>
				<div className="flex items-center justify-center">
					{preview ? (
						<Image
							src={preview || '/placeholder.svg'}
							alt="Avatar preview"
							width={100}
							height={100}
							className="rounded-full object-cover max-h-24 max-w-24 min-h-24 max-w-24"
						/>
					) : (
						<div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
							<span className="text-gray-500">нет фото</span>
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
					{updateLoading ? 'Загрузка...' : 'Загрузить фото'}
				</Button>
			</form>
		</div>
	);
};

export default UploadUserPhoto;
