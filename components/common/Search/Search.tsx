'use client';

import { Dispatch, SetStateAction } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Search({
	searchState,
	onSearch,
	className,
	placeholder,
}: {
	searchState: [string, Dispatch<SetStateAction<string>>];
	onSearch?: () => void;
	className?: string;
	placeholder?: string;
}) {
	const [searchQuery, setSearchQuery] = searchState;

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
		onSearch?.();
	};

	const clearSearch = () => {
		setSearchQuery('');
	};

	return (
		<div className={cn('relative w-full max-w-[300px]', className)}>
			<SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-primary" />
			<Input
				placeholder={placeholder || 'Поиск...'}
				className="pl-8 pr-8"
				value={searchQuery}
				onChange={handleSearch}
			/>
			{searchQuery && (
				<Button
					variant="ghost"
					size="icon"
					className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
					onClick={clearSearch}
				>
					<X className="h-4 w-4 text-primary" />
					<span className="sr-only">Очистить поиск</span>
				</Button>
			)}
		</div>
	);
}
