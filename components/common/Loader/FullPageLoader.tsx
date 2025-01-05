'use client';
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
	message?: string;
}

const FullPageLoader = ({ message = 'Загрузка...' }: LoaderProps) => {
	return (
		<div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
			<div className="flex flex-col items-center space-y-4">
				<Loader2 className="h-12 w-12 text-primary animate-spin" />
				{message && (
					<p className="text-base font-medium text-primary">{message}</p>
				)}
			</div>
		</div>
	);
};

export default FullPageLoader;
