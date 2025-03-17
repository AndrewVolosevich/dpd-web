import type { Question, Response, Survey } from '@/types/entities';

/**
 * Преобразует значение ответа в строку для CSV в зависимости от типа вопроса
 */
const formatAnswerValue = (value: any, question: Question): string => {
	if (!value) return '';

	switch (question.type) {
		case 'OPEN_TEXT':
			return String(value).replace(/"/g, '""'); // Экранирование кавычек для CSV

		case 'SINGLE_CHOICE':
			return String(value).replace(/"/g, '""');

		case 'MULTIPLE_CHOICE':
			if (Array.isArray(value)) {
				return value.map((v) => String(v).replace(/"/g, '""')).join(', ');
			}
			return String(value).replace(/"/g, '""');

		case 'RATING':
			return String(value);

		case 'MATRIX':
			if (typeof value === 'object') {
				return Object.entries(value)
					.map(([row, col]) => `${row}: ${col}`)
					.join('; ');
			}
			return String(value);

		case 'PHOTO':
			if (Array.isArray(value)) {
				return value.map((v) => String(v)).join(', ');
			}
			return String(value);

		default:
			return String(value);
	}
};

/**
 * Получает заголовок для вопроса в зависимости от его типа
 */
const getQuestionHeader = (question: Question): string => {
	const header = question.text.replace(/"/g, '""');

	if (question.type === 'MATRIX' && question.ratingConfig?.rows) {
		// Для матричных вопросов добавляем подзаголовки для каждой строки
		return question.ratingConfig.rows
			.map((row) => `${header} - ${row}`)
			.join(',');
	}

	return header;
};

/**
 * Получает значение ответа для вопроса в зависимости от его типа
 */
const getAnswerValue = (response: Response, question: Question): string[] => {
	const answer = response.answers.find((a) => a.questionId === question.id);

	if (!answer) return [''];

	if (question.type === 'MATRIX' && question.ratingConfig?.rows) {
		// Для матричных вопросов возвращаем массив значений для каждой строки
		return question.ratingConfig.rows.map((row) => {
			const rowValue =
				answer.value && typeof answer.value === 'object'
					? answer.value[row]
					: '';
			return rowValue ? `"${String(rowValue).replace(/"/g, '""')}"` : '';
		});
	}

	// Для остальных типов вопросов возвращаем одно значение
	return [`"${formatAnswerValue(answer.value, question)}"`];
};

/**
 * Экспортирует результаты опроса в CSV
 */
export const exportSurveyToCsv = (survey: Survey): void => {
	if (!survey || !survey.questions || !survey.responses) {
		console.error('Нет данных для экспорта');
		return;
	}

	// Создаем заголовки CSV
	const headers = ['ID респондента', 'Дата прохождения'];
	const questionHeadersFlat: string[] = [];

	// Добавляем заголовки для каждого вопроса
	survey.questions.forEach((question) => {
		const questionHeaders = getQuestionHeader(question).split(',');
		questionHeadersFlat.push(...questionHeaders);
	});

	headers.push(...questionHeadersFlat);

	// Создаем строки с данными
	const rows: string[][] = [];

	survey.responses.forEach((response) => {
		const row: string[] = [
			response.userId,
			new Date(response.createdAt).toLocaleString(),
		];

		// Добавляем ответы на каждый вопрос
		survey.questions.forEach((question) => {
			const answerValues = getAnswerValue(response, question);
			row.push(...answerValues);
		});

		rows.push(row);
	});

	// Формируем CSV строку
	let csvContent =
		headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(',') + '\n';

	rows.forEach((row) => {
		csvContent += row.join(',') + '\n';
	});

	// Создаем и скачиваем файл
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');

	link.setAttribute('href', url);
	link.setAttribute(
		'download',
		`${survey.title.replace(/[^\w\s]/gi, '')}_results.csv`,
	);
	link.style.visibility = 'hidden';

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
