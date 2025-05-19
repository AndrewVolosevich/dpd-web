import type { Survey } from '@/types/entities';

/**
 * Преобразует значение ответа в строку для CSV в зависимости от типа вопроса
 */
// const formatAnswerValue = (value: any, question: Question): string => {
// 	if (!value) return '';
//
// 	switch (question.type) {
// 		case 'OPEN_TEXT':
// 			return String(value).replace(/"/g, '""'); // Экранирование кавычек для CSV
//
// 		case 'SINGLE_CHOICE':
// 			return String(value).replace(/"/g, '""');
//
// 		case 'MULTIPLE_CHOICE':
// 			if (Array.isArray(value)) {
// 				return value.map((v) => String(v).replace(/"/g, '""')).join(', ');
// 			}
// 			return String(value).replace(/"/g, '""');
//
// 		case 'RATING':
// 			return String(value);
//
// 		case 'MATRIX':
// 			if (typeof value === 'object') {
// 				return Object.entries(value)
// 					.map(([row, col]) => `${row}: ${col}`)
// 					.join('; ');
// 			}
// 			return String(value);
//
// 		case 'PHOTO':
// 			if (Array.isArray(value)) {
// 				return value.map((v) => String(v)).join(', ');
// 			}
// 			return String(value);
//
// 		default:
// 			return String(value);
// 	}
// };

/**
 * Получает заголовок для вопроса в зависимости от его типа
 */
// const getQuestionHeader = (question: Question): string => {
// 	const header = question.text.replace(/"/g, '""');
//
// 	if (question.type === 'MATRIX' && question.ratingConfig?.rows) {
// 		// Для матричных вопросов добавляем подзаголовки для каждой строки
// 		return question.ratingConfig.rows
// 			.map((row) => `${header} - ${row}`)
// 			.join(',');
// 	}
//
// 	return header;
// };

/**
 * Получает значение ответа для вопроса в зависимости от его типа
 */
// const getAnswerValue = (response: Response, question: Question): string[] => {
// 	const answer = response.answers.find((a) => a.questionId === question.id);
//
// 	if (!answer) return [''];
//
// 	if (question.type === 'MATRIX' && question.ratingConfig?.rows) {
// 		// Для матричных вопросов возвращаем массив значений для каждой строки
// 		return question.ratingConfig.rows.map((row) => {
// 			const rowValue =
// 				answer.value && typeof answer.value === 'object'
// 					? answer.value[row]
// 					: '';
// 			return rowValue ? `"${String(rowValue).replace(/"/g, '""')}"` : '';
// 		});
// 	}
//
// 	// Для остальных типов вопросов возвращаем одно значение
// 	return [`"${formatAnswerValue(answer.value, question)}"`];
// };

/**
 * Преобразует значение ответа в строку для CSV с учётом кириллицы и экранирования
 */
const formatValueForCsv = (value: any): string => {
	if (value === null || value === undefined) {
		return '""';
	}
	return `"${String(value).replace(/"/g, '""')}"`;
};

/**
 * Экспорт результатов опроса в CSV
 */
export const exportSurveyToCsv = (survey: Survey): void => {
	if (!survey || !survey.questions || !survey.responses) {
		console.error('Нет данных для экспорта');
		return;
	}

	// Создаем заголовки CSV
	const headers = ['ID респондента', 'Дата прохождения'];

	// Добавляем заголовки для каждого вопроса
	survey.questions.forEach((question) => {
		if (question.type === 'MATRIX' && question.ratingConfig?.rows) {
			// Для матричных вопросов добавляем отдельный заголовок для строк
			question.ratingConfig.rows.forEach((row) => {
				headers.push(`${question.text} - ${row}`.replace(/"/g, '""'));
			});
		} else {
			headers.push(question.text.replace(/"/g, '""'));
		}
	});

	// Создаем строки CSV
	const rows: string[] = [];
	survey?.responses?.forEach((response) => {
		const row = [
			formatValueForCsv(response.userId),
			formatValueForCsv(new Date(response.createdAt).toLocaleString()),
		];

		// Добавляем ответы для каждого вопроса
		survey?.questions?.forEach((question) => {
			const answer = response?.answers?.find(
				(a) => a?.questionId === question?.id,
			);

			if (!answer) {
				if (question?.type === 'MATRIX' && question?.ratingConfig?.rows) {
					// Если матричный вопрос — добавляем пустые значения для строк
					question?.ratingConfig?.rows?.forEach(() => {
						row.push(formatValueForCsv(''));
					});
				} else {
					// Для остальных вопросов добавляем просто пустое значение
					row.push(formatValueForCsv(''));
				}
				return;
			}

			// Форматируем значение ответа
			if (question.type === 'MATRIX' && question.ratingConfig?.rows) {
				// Для матричных вопросов добавляем значения строк
				question.ratingConfig.rows.forEach((rowKey) => {
					const rowValue =
						answer?.value && typeof answer?.value === 'object'
							? (answer.value[rowKey] ?? '')
							: '';
					row.push(formatValueForCsv(rowValue));
				});
			} else {
				// Для остальных типов формируем значение через общую функцию
				row.push(formatValueForCsv(answer.value));
			}
		});

		rows.push(row.join(','));
	});

	// Добавляем BOM в начало для корректного поведения Excel
	const csvContent =
		'\uFEFF' +
		headers.map((header) => formatValueForCsv(header)).join(',') +
		'\n' +
		rows.join('\n');

	// Создаем и скачиваем файл
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');

	// Имя файла для скачивания
	const filename = `export-test-results.csv`;

	link.setAttribute('href', url);
	link.setAttribute('download', filename);
	link.style.visibility = 'hidden';

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

/**
 * Экспорт данных в CSV файл
 * @param {Array<{key: string, title: string}>} columns - Массив объектов с ключами и названиями столбцов
 * @param {Object[]} data - Массив объектов с данными
 * @param {string} [filename='export.csv'] - Имя файла для сохранения
 */
export const exportDataToCsv = (
	columns: Array<{ key: string; title: string }>,
	data: any,
	filename = 'export.csv',
) => {
	if (!columns || !Array.isArray(columns) || columns.length === 0) {
		console.error('Invalid columns configuration');
		return;
	}

	if (!data || !Array.isArray(data)) {
		console.error('Invalid data provided');
		return;
	}

	// Добавляем BOM для правильной кодировки в Excel
	let csv = '\uFEFF';

	// Заголовки
	csv +=
		columns.map((col) => `"${col.title.replace(/"/g, '""')}"`).join(',') + '\n';

	// Данные
	data.forEach((row) => {
		const rowValues = columns.map((col) => {
			let value = row[col.key] !== undefined ? row[col.key] : '';
			// Преобразуем null в пустую строку
			if (value === null) value = '';
			return `"${String(value).replace(/"/g, '""')}"`;
		});
		csv += rowValues.join(',') + '\n';
	});

	// Создаем Blob с правильной кодировкой
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);

	link.setAttribute('href', url);
	link.setAttribute('download', filename);
	link.style.visibility = 'hidden';

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
