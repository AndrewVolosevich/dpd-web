'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TimeLine } from '@/types/content';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface TimeLineFormProps {
	onSubmit: (data: TimeLine) => void;
	onCancel: () => void;
	initialData?: TimeLine | null;
	isLoading: boolean;
}

export const TimeLineForm = ({
	onSubmit,
	onCancel,
	initialData,
	isLoading,
}: TimeLineFormProps) => {
	const [year, setYear] = useState(initialData?.year || 2024);
	const [content, setContent] = useState(initialData?.content || ['']);

	const addContentItem = () => {
		setContent([...content, '']);
	};

	const removeContentItem = (index: number) => {
		if (content.length > 1) {
			setContent(content.filter((_, i) => i !== index));
		}
	};

	const updateContentItem = (index: number, value: string) => {
		const newContent = [...content];
		newContent[index] = value;
		setContent(newContent);
	};

	const hasValidContent = content.some((item) => item.trim() !== '');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const filteredContent = content.filter((item) => item.trim() !== '');
		if (year && filteredContent.length > 0) {
			onSubmit({ year, content: filteredContent });
		}
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="year">Год</Label>
				<Input
					type={'number'}
					min="1900"
					max="2100"
					id="year"
					value={year}
					onChange={(e) => setYear(Number(e.target.value))}
					placeholder="Введите год"
					required
				/>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Label>Контент</Label>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addContentItem}
						className="flex items-center gap-2"
					>
						<Plus className="w-4 h-4" />
						Добавить пункт
					</Button>
				</div>

				<div className="space-y-3">
					{content.map((item, index) => (
						<div key={index} className="flex gap-2">
							<div className="flex-1">
								<Textarea
									value={item}
									onChange={(e) => updateContentItem(index, e.target.value)}
									placeholder={`Пункт ${index + 1}...`}
									className="min-h-[80px] resize-none"
									rows={3}
								/>
							</div>
							{content.length > 1 && (
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={() => removeContentItem(index)}
									className="flex-shrink-0 mt-1 text-primary hover:text-red-700 hover:bg-red-50"
								>
									<Trash2 className="w-4 h-4" />
								</Button>
							)}
						</div>
					))}
				</div>

				{!hasValidContent && (
					<p className="text-sm text-primary">
						Добавьте хотя бы один пункт контента
					</p>
				)}
			</div>

			<div className="flex justify-end space-x-2 mt-4">
				<Button type="button" variant="outline" onClick={onCancel}>
					Отмена
				</Button>
				<Button
					onClick={handleSubmit}
					type="button"
					disabled={isLoading || !year || !hasValidContent}
				>
					{isLoading ? 'Сохранение...' : 'Сохранить'}
				</Button>
			</div>
		</div>
	);
};
