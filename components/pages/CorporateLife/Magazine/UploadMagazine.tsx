import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import useApi from '@/hooks/useApi';
import { Input } from '@/components/ui/input';

interface UploadMagazineProps {
	onClose: () => void;
}

const UploadMagazine = ({ onClose }: UploadMagazineProps) => {
	const formRef = useRef<HTMLFormElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [title, setTitle] = useState<string>('');
	const queryClient = useQueryClient();

	const api = useApi();
	const { mutate: uploadMagazine, isPending: uploadingMagazine } = useMutation({
		mutationFn: async (data: any) => {
			const resp = await api.post(`/upload/magazine`, data);
			return resp?.data;
		},
		onError: (error) => {
			toast({
				title: 'Неудачная загрузка журнала',
				variant: 'destructive',
				description: error.message,
			});
		},
		onSuccess: async () => {
			// Reset the form and preview
			formRef.current?.reset();
			setPreview(null);
			setTitle('');
			await queryClient.invalidateQueries({
				queryKey: ['magazines'],
			});
			if (fileInputRef.current) fileInputRef.current.value = '';

			toast({
				title: 'Журнал успешно загружен',
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
		if (title) {
			formData.append('title', title);
		}
		await uploadMagazine(formData);
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
