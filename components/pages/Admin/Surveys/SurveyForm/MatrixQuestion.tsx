'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, ListPlus } from 'lucide-react';
import { useState } from 'react';
import { BulkOptionsModal } from '@/components/common/BulkOptionsModal/BulkOptionsModal';

interface MatrixQuestionProps {
	question: {
		rows: string[];
		columns: string[];
	};
	onChange: (updates: { rows?: string[]; columns?: string[] }) => void;
}

export function MatrixQuestion({ question, onChange }: MatrixQuestionProps) {
	const [isBulkRowsModalOpen, setBulkRowsModalOpen] = useState(false);
	const [isBulkColumnsModalOpen, setBulkColumnsModalOpen] = useState(false);

	const addRow = () => {
		onChange({ rows: [...question.rows, ''] });
	};

	const updateRow = (index: number, value: string) => {
		const newRows = [...question.rows];
		newRows[index] = value;
		onChange({ rows: newRows });
	};

	const removeRow = (index: number) => {
		const newRows = question.rows.filter((_, i) => i !== index);
		onChange({ rows: newRows });
	};

	const addColumn = () => {
		onChange({ columns: [...question.columns, ''] });
	};

	const updateColumn = (index: number, value: string) => {
		const newColumns = [...question.columns];
		newColumns[index] = value;
		onChange({ columns: newColumns });
	};

	const removeColumn = (index: number) => {
		const newColumns = question.columns.filter((_, i) => i !== index);
		onChange({ columns: newColumns });
	};

	return (
		<div className="space-y-6">
			{/* Rows Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Label>Утверждения (строки)</Label>
					<div className="flex gap-2">
						<Button variant="outline" size="sm" onClick={addRow}>
							<PlusCircle className="h-4 w-4 mr-2" />
							Добавить строку
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setBulkRowsModalOpen(true)}
						>
							<ListPlus className="h-4 w-4 mr-2" />
							Добавить несколько
						</Button>
					</div>
				</div>

				<div className="space-y-2">
					{question.rows.map((row, index) => (
						<div key={index} className="flex gap-2">
							<Input
								value={row}
								onChange={(e) => updateRow(index, e.target.value)}
								placeholder={`Утверждение ${index + 1}`}
							/>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => removeRow(index)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>
			</div>

			{/* Columns Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Label>Варианты ответов (колонки)</Label>
					<div className="flex gap-2">
						<Button variant="outline" size="sm" onClick={addColumn}>
							<PlusCircle className="h-4 w-4 mr-2" />
							Добавить колонку
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setBulkColumnsModalOpen(true)}
						>
							<ListPlus className="h-4 w-4 mr-2" />
							Добавить несколько
						</Button>
					</div>
				</div>

				<div className="space-y-2">
					{question.columns.map((column, index) => (
						<div key={index} className="flex gap-2">
							<Input
								value={column}
								onChange={(e) => updateColumn(index, e.target.value)}
								placeholder={`Вариант ${index + 1}`}
							/>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => removeColumn(index)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>
			</div>

			{/* Preview Section */}
			<div className="border rounded-lg p-4">
				<Label className="block mb-4">Предпросмотр:</Label>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr>
								<th className="p-2 border-b"></th>
								{question.columns.map((column, index) => (
									<th
										key={index}
										className="p-2 border-b text-center whitespace-nowrap"
									>
										{column || `Вариант ${index + 1}`}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{question.rows.map((row, rowIndex) => (
								<tr key={rowIndex}>
									<td className="p-2 border-b">
										{row || `Утверждение ${rowIndex + 1}`}
									</td>
									{question.columns.map((_, colIndex) => (
										<td key={colIndex} className="p-2 border-b text-center">
											<div className="flex justify-center">
												<div className="h-4 w-4 rounded-full border border-gray-300" />
											</div>
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<BulkOptionsModal
				isOpen={isBulkRowsModalOpen}
				onClose={() => setBulkRowsModalOpen(false)}
				onAdd={(options) => {
					onChange({ rows: [...question.rows, ...options] });
				}}
			/>

			<BulkOptionsModal
				isOpen={isBulkColumnsModalOpen}
				onClose={() => setBulkColumnsModalOpen(false)}
				onAdd={(options) => {
					onChange({ columns: [...question.columns, ...options] });
				}}
			/>
		</div>
	);
}
