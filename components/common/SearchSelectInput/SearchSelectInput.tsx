import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SearchSelectInputProps {
	options: string[];
	value: string;
	onChange: (value: string) => void;
	className?: string;
	inputId?: string;
	labelTitle?: string;
	placeholder?: string;
	inputRequired?: boolean;
	inputDisabled?: boolean;
	inputClassName?: string;
}

export const SearchSelectInput: React.FC<SearchSelectInputProps> = ({
	options,
	value,
	onChange,
	inputDisabled,
	placeholder,
	inputRequired,
	inputClassName,
	inputId,
	className,
	labelTitle,
}) => {
	const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		onChange(inputValue);

		const filtered = options.filter((option) =>
			option.toLowerCase().includes(inputValue.toLowerCase()),
		);
		setFilteredOptions(filtered);
		setIsDropdownOpen(true);
	};

	const handleOptionClick = (option: string) => {
		onChange(option);
		setIsDropdownOpen(false);
	};

	return (
		<div className={className}>
			<Label htmlFor={inputId}>{labelTitle}</Label>
			<input
				type="text"
				id={inputId}
				required={inputRequired}
				disabled={inputDisabled}
				autoFocus={false}
				className={cn('outline-0 w-full rounded px-0 py-2', inputClassName)}
				value={value}
				placeholder={placeholder}
				onChange={handleInputChange}
				onFocus={() => setIsDropdownOpen(true)}
				onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
			/>
			{isDropdownOpen && filteredOptions.length > 0 && (
				<ul className="absolute top-full left-0 mt-1 w-full max-h-48 overflow-y-auto border rounded bg-white shadow-md z-10 list-none px-0 py-2">
					{filteredOptions.map((option, index) => (
						<li
							key={index}
							onClick={() => handleOptionClick(option)}
							className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
						>
							{option}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
