'use client';

import Image from 'next/image';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

function CustomImageRenderer({ data }: any) {
	const src = data.file.url;
	const caption = data.caption;
	const isStretched = data?.stretched;

	// Состояния для хранения ширины и высоты изображения
	const [imageSize, setImageSize] = useState<{
		width: number;
		height: number;
	} | null>(null);

	useEffect(() => {
		// Создаем HTMLImageElement для получения размеров картинки
		const img = document.createElement('img') as HTMLImageElement;
		img.src = src;
		img.onload = () => {
			setImageSize({ width: img.width, height: img.height });
		};
	}, [src]);

	// Если размеры картинки еще не получены, можно вернуть заглушку или загрузчик
	if (!imageSize) {
		return <div className="w-full h-64 bg-gray-200 animate-pulse" />;
	}

	return (
		<div className={'flex-col'}>
			<div
				className={clsx(
					'relative overflow-hidden',
					isStretched ? 'w-full' : 'mx-auto',
				)}
				style={{
					width: isStretched ? '100%' : `${imageSize.width}px`,
					maxWidth: '100%',
					height: `${imageSize.height}px`,
				}}
			>
				<Image
					alt="image"
					className="object-contain"
					src={src}
					width={imageSize.width}
					height={imageSize.height}
					priority={false}
				/>
			</div>
			{caption && <h3 className={'!mt-0 text-center'}>{caption}</h3>}
		</div>
	);
}

export default CustomImageRenderer;
