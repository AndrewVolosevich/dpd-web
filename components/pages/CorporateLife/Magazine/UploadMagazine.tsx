import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUploadMagazine } from '@/lib/api/queries/Magazines/mutations/useUploadMagazine';

interface UploadMagazineProps {
	onClose: () => void;
}

const UploadMagazine = ({ onClose }: UploadMagazineProps) => {
	const formRef = useRef<HTMLFormElement>(null);
	const [title, setTitle] = useState<string>('');
	const [file, setFile] = useState<File | null>(null);
	const [image, setImage] = useState<File | null>(null);

	const { mutate: uploadMagazine, isPending: uploadingMagazine } =
		useUploadMagazine();

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setFile(file);
		}
	};
	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const image = event.target.files?.[0];
		if (image) {
			setImage(image);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData();
		if (title) {
			formData.append('title', title);
		}
		if (file) {
			formData.append('file', file, file?.name);
		}
		if (image) {
			formData.append('image', image, image?.name);
		}
		uploadMagazine(formData, {
			onSuccess: async () => {
				formRef.current?.reset();
				setTitle('');
			},
			onSettled: () => {
				onClose();
			},
		});
	};

	return (
		<div className={'mt-4'}>
			<form onSubmit={handleSubmit} className="space-y-4" ref={formRef}>
				<div>
					<Input
						id="title"
						type="text"
						value={title}
						placeholder={'Название журнала'}
						onChange={(e) => setTitle(e?.target?.value)}
					/>
				</div>
				<div>
					<label
						htmlFor="pdf"
						className="block text-sm font-medium text-gray-700"
					>
						Выберите журнал
					</label>
					<input
						type="file"
						id="pdf"
						name="file"
						accept=".pdf"
						onChange={handleFileChange}
						className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-[hsl(346,100%,95%)] file:text-[hsl(346,100%,43%)]
                       hover:file:bg-[hsl(346,100%,90%)]"
					/>
				</div>
				<div>
					<label
						htmlFor="image"
						className="block text-sm font-medium text-gray-700"
					>
						Выберите обложку
					</label>
					<input
						type="file"
						id="image"
						name="image"
						accept="image/*"
						onChange={handleImageChange}
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
					disabled={!title || !file || !image || uploadingMagazine}
					className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[hsl(346,100%,43%)] hover:bg-[hsl(346,100%,38%)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[hsl(346,100%,43%)] disabled:opacity-50"
				>
					{uploadingMagazine ? 'Загрузка...' : 'Загрузить журнал'}
				</Button>
			</form>
		</div>
	);
};

export default UploadMagazine;
