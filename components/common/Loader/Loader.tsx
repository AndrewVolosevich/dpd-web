'use client';
import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface LoaderProps {
	message?: string;
	className?: string;
}

const Loader = ({ message = 'Загрузка...', className }: LoaderProps) => {
	return (
		<div
			className={clsx(
				'w-full h-full inset-0 flex items-center justify-center',
				className,
			)}
		>
			<div className="flex flex-col items-center space-y-4">
				<Loader2 className="h-12 w-12 text-primary animate-spin" />
				{message && (
					<p className="text-base font-medium text-primary">{message}</p>
				)}
			</div>
		</div>
	);
};

export { Loader };
