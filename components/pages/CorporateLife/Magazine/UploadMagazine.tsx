import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUploadMagazine } from '@/lib/api/queries/Magazines/mutations/useUploadMagazine';

interface UploadMagazineProps {
	onClose: () => void;
}

const UploadMagazine = ({ onClose }: UploadMagazineProps) => {
	const formRef = useRef<HTMLFormElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [title, setTitle] = useState<string>('');

	const { mutate: uploadMagazine, isPending: uploadingMagazine } =
		useUploadMagazine();

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
		if (title) {
			formData.append('title', title);
		}
		uploadMagazine(formData, {
			onSuccess: async () => {
				// Reset the form and preview
				formRef.current?.reset();
				setPreview(null);
				setTitle('');
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
					disabled={!preview || !title || uploadingMagazine}
					className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[hsl(346,100%,43%)] hover:bg-[hsl(346,100%,38%)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[hsl(346,100%,43%)] disabled:opacity-50"
				>
					{uploadingMagazine ? 'Загрузка...' : 'Загрузить журнал'}
				</Button>
			</form>
		</div>
	);
};

export default UploadMagazine;
