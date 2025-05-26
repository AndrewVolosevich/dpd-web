import React from 'react';
import { Question } from '@/types/entities';
import { Badge } from '@/components/ui/badge';

interface OrderingResultsProps {
	question: Question;
}

export const OrderingResults: React.FC<OrderingResultsProps> = ({
	question,
}) => {
	if (!question.answers || question.answers.length === 0) {
		return <p className="text-muted-foreground">Ответы отсутствуют</p>;
	}

	// Ожидаемая последовательность значений
	const correctOrder = question.options
		.sort((a, b) => (a.correctOrder || 0) - (b.correctOrder || 0))
		.map((option) => option.value);

	// Обработка ответов для сбора статистики
	const results = question.answers.map((answer) => {
		// Проверка, совпадает ли ответ с правильным порядком
		const isCorrect =
			JSON.stringify(answer.value) === JSON.stringify(correctOrder);

		return {
			userId: answer.id,
			isCorrect,
			answer: answer.value,
		};
	});

	// Подсчёт правильных и неправильных ответов
	const correctCount = results.filter((result) => result.isCorrect).length;
	const totalCount = results.length;

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-medium">Результаты ответов</h3>

			{/* Отображение сводной информации */}
			<div className="space-y-2">
				<p>
					<b>Правильных ответов:</b>{' '}
					<Badge>
						{correctCount} из {totalCount}
					</Badge>
				</p>
				<p>
					<b>Ожидаемая последовательность:</b> {correctOrder.join(' → ')}
				</p>
			</div>

			{/* Детализация по каждому ответу */}
			<h4 className="text-md font-medium">Ответы пользователей:</h4>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{results.map((result, idx) => (
					<div
						key={idx}
						className={`p-4 border rounded-md ${
							result.isCorrect ? 'border-green-500' : 'border-red-500'
						}`}
					>
						<p>
							<b>Ответ:</b> {result.answer.join(' → ')}
						</p>
						<p>
							<b>Результат:</b>{' '}
							<span
								className={`${
									result.isCorrect ? 'text-green-600' : 'text-red-600'
								}`}
							>
								{result.isCorrect ? 'Правильно' : 'Неправильно'}
							</span>
						</p>
					</div>
				))}
			</div>
		</div>
	);
};
