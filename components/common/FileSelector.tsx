import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface FileSelectorProps {
	initialUrl?: string;
	useFile: [File | null, React.Dispatch<React.SetStateAction<File | null>>];
	isImage?: boolean;
	isAvatar?: boolean;
}

const wideImgCls =
	'relative w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden';
const avatarImgCls =
	'relative w-[100px] h-[100px] bg-gray-100 rounded-full overflow-hidden flex shrink-0';

const FileSelector = ({
	initialUrl,
	useFile,
	isImage = false,
	isAvatar = false,
}: FileSelectorProps) => {
	const [preview, setPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [, setFile] = useFile;

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const uploadedFile = e.target.files[0];
			setFile(uploadedFile);
			if (isImage && uploadedFile) {
				const reader = new FileReader();
				reader.onloadend = () => {
					setPreview(reader.result as string);
				};
				reader.readAsDataURL(uploadedFile);
			}
		}
	};

	const getTitle = () => {
		if (isImage && initialUrl) {
			return 'Выберите новое изображение';
		} else if (isImage) {
			return 'Выберите изображение';
		}
		return 'Выберите файл';
	};

	return (
		<div className={'mt-4'}>
			<div className="space-y-4">
				{
					<div className="flex items-center justify-center">
						{preview || initialUrl ? (
							<div className={isAvatar ? avatarImgCls : wideImgCls}>
								<Image
									src={preview || initialUrl || '/placeholder.svg'}
									alt="Preview"
									fill
									className="object-cover"
								/>
							</div>
						) : (
							<div
								className={cn(
									isAvatar ? avatarImgCls : wideImgCls,
									'flex items-center justify-center',
								)}
							>
								<span
									className={cn(
										isAvatar && 'text-xs px-1 text-center',
										'text-gray-500',
									)}
								>
									Нет изображения
								</span>
							</div>
						)}
					</div>
				}
				<div>
					<label
						htmlFor="file"
						className="block text-sm font-medium text-gray-700"
					>
						{getTitle()}
					</label>
					<input
						type="file"
						id="file"
						name="file"
						accept="isImage ? 'image/*' : '*/*'"
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
			</div>
		</div>
	);
};

export default FileSelector;
