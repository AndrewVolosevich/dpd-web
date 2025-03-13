'use client';

import { Question } from '@/types/entities';

interface MatrixQuestionProps {
	question: Question;
	value: Record<string, string>;
	onChange: (value: Record<string, string>) => void;
}

export function MatrixQuestion({
	question,
	value,
	onChange,
}: MatrixQuestionProps) {
	const rows = question.ratingConfig?.rows || [];
	const columns = question.ratingConfig?.columns || [];

	const handleChange = (rowIndex: number, columnValue: string) => {
		onChange({
			...value,
			[rowIndex]: columnValue,
		});
	};

	if (rows.length === 0 || columns.length === 0) {
		return (
			<div className="text-red-500">
				Ошибка: матричный вопрос не содержит строк или колонок
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full border-collapse">
				<thead>
					<tr className="bg-muted/50">
						<th className="p-2 border-b text-left w-[40%]"></th>
						{columns.map((column, index) => (
							<th
								key={index}
								className="p-2 border-b text-center w-[12%] min-w-[100px]"
							>
								<div className="whitespace-normal text-sm">{column}</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, rowIndex) => (
						<tr
							key={rowIndex}
							className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-muted/20'}
						>
							<td className="p-2 border-b align-middle">
								<div className="text-sm">{row}</div>
							</td>
							{columns.map((column, colIndex) => (
								<td
									key={colIndex}
									className="p-2 border-b text-center align-middle"
								>
									<div className="flex justify-center">
										<input
											type="radio"
											className="h-4 w-4 rounded-full border border-gray-300"
											name={`matrix-${rowIndex}`}
											value={column}
											checked={value[rowIndex] === column}
											onChange={() => handleChange(rowIndex, column)}
										/>
									</div>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
