'use client';

import Image from 'next/image';
import { clsx } from 'clsx';

function CustomImageRenderer({ data }: any) {
	const src = data.file.url;
	const caption = data.caption;
	const isStretched = data?.stretched;

	return (
		<div className={'flex-col'}>
			<div className="relative w-full min-h-[25rem]">
				<Image
					alt="image"
					className={clsx(isStretched ? 'object-cover' : 'object-contain')}
					fill
					src={src}
				/>
			</div>
			<h3 className={'!mt-0 text-center'}>{caption}</h3>
		</div>
	);
}

export default CustomImageRenderer;
