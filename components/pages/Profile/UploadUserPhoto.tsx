import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { UserData } from '@/types/entities';
import { useAuth } from '@/components/providers/global/AuthProvider';
import { useUploadUserPhoto } from '@/lib/api/queries/Users/mutations/useUploadUserPhoto';

interface UploadUserPhotoProps {
	user?: UserData;
	onClose: () => void;
}

const UploadUserPhoto = ({ user, onClose }: UploadUserPhotoProps) => {
	const [preview, setPreview] = useState<string | null>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { updateUser: updateSelfUser, user: currentUser } = useAuth();
	const { mutate: updatePhoto, isPending: updateLoading } =
		useUploadUserPhoto();

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
		updatePhoto(formData, {
			onSuccess: async (u: any) => {
				if (currentUser?.id === u?.id) {
					updateSelfUser(u);
				}
				// Reset the form and preview
				formRef.current?.reset();
				setPreview(null);
				if (fileInputRef.current) fileInputRef.current.value = '';
			},
			onSettled: () => {
				onClose();
			},
		});
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
						Выберите изображение <br />
						(размер 200х200 / 300х300 и не более 2Mb)
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
