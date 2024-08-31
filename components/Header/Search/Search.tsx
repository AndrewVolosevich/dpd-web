import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type SearchProps = React.HTMLAttributes<HTMLDivElement>;

const Search = ({ className }: SearchProps) => {
	return (
		<div
			className={cn(
				'flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0 w-full lg:w-auto',
				className,
			)}
		>
			<div className="flex w-full max-w-sm items-center space-x-2">
				<Input type="email" placeholder="Поиск..." />
				<Button type="button" variant="outline">
					Найти
				</Button>
			</div>
		</div>
	);
};

export { Search };
