'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface MatrixResultsProps {
	question: {
		id: string;
		text: string;
		ratingConfig?: {
			rows?: string[];
			columns?: string[];
		};
		answers: Array<{
			id: string;
			value: Record<string, string>;
			comment?: string;
		}>;
	};
}

export function MatrixResults({ question }: MatrixResultsProps) {
	const results = useMemo(() => {
		const rows = question.ratingConfig?.rows || [];
		const columns = question.ratingConfig?.columns || [];

		// Создаем матрицу для подсчета ответов
		const matrix: Record<string, Record<string, number>> = {};

		// Инициализация матрицы
		rows.forEach((row, rowIndex) => {
			matrix[rowIndex] = {};
			columns.forEach((column) => {
				matrix[rowIndex][column] = 0;
			});
		});

		// Подсчет ответов
		question.answers.forEach((answer) => {
			if (answer.value && typeof answer.value === 'object') {
				Object.entries(answer.value).forEach(([rowIndex, columnValue]) => {
					if (matrix[rowIndex] && columnValue) {
						matrix[rowIndex][columnValue] =
							(matrix[rowIndex][columnValue] || 0) + 1;
					}
				});
			}
		});

		// Расчет процентов для каждой ячейки
		const percentageMatrix: Record<string, Record<string, number>> = {};
		rows.forEach((_, rowIndex) => {
			percentageMatrix[rowIndex] = {};

			const rowTotal = columns.reduce(
				(sum, column) => sum + (matrix[rowIndex][column] || 0),
				0,
			);

			columns.forEach((column) => {
				percentageMatrix[rowIndex][column] =
					rowTotal > 0
						? Math.round(((matrix[rowIndex][column] || 0) / rowTotal) * 100)
						: 0;
			});
		});

		return {
			matrix,
			percentageMatrix,
			rows,
			columns,
			totalAnswers: question.answers.length,
		};
	}, [question]);

	return (
		<div className="space-y-4">
			<p className="text-sm text-muted-foreground">
				Всего ответов: {results.totalAnswers}
			</p>

			<Card>
				<CardContent className="p-4">
					<div className="overflow-x-auto">
						<table className="w-full border-collapse">
							<thead>
								<tr className="bg-muted/50">
									<th className="p-2 border-b text-left"></th>
									{results.columns.map((column, index) => (
										<th
											key={index}
											className="p-2 border-b text-center whitespace-nowrap"
										>
											{column}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{results.rows.map((row, rowIndex) => (
									<tr
										key={rowIndex}
										className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-muted/20'}
									>
										<td className="p-2 border-b font-medium">{row}</td>
										{results.columns.map((column, colIndex) => (
											<td key={colIndex} className="p-2 border-b text-center">
												<div className="text-sm">
													{results.matrix[rowIndex][column]} (
													{results.percentageMatrix[rowIndex][column]}%)
												</div>
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			<div className="space-y-6 mt-4">
				<h4 className="text-sm font-medium">
					Распределение ответов по строкам:
				</h4>
				{results.rows.map((row, rowIndex) => (
					<div key={rowIndex} className="space-y-2">
						<h5 className="text-sm">{row}</h5>
						<div className="space-y-2">
							{results.columns.map((column, colIndex) => (
								<div key={colIndex} className="space-y-1">
									<div className="flex justify-between">
										<span className="text-sm">{column}</span>
										<span className="text-xs">
											{results.matrix[rowIndex][column]} (
											{results.percentageMatrix[rowIndex][column]}%)
										</span>
									</div>
									<Progress
										value={results.percentageMatrix[rowIndex][column]}
										className="h-1"
									/>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
