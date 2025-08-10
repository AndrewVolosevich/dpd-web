import { Question, Survey, SurveyResponse } from '@/types/entities';
/**
 * Преобразует значение ответа в строку для CSV с учётом кириллицы и экранирования
 */
export const formatValueForCsv = (value: any): string => {
	if (value === null || value === undefined) {
		return '""';
	}
	return `"${String(value)
		.replace(/"/g, '""')
		.replace(/\n/g, ' ')
		.replace(/\r/g, '')}"`;
};

// Генерация заголовков для CSV
const generateCsvHeaders = (
	questions: Question[],
	hideUser: boolean,
): string[] => {
	const headers = hideUser
		? ['Дата прохождения']
		: ['ID респондента', 'Дата прохождения'];

	questions.forEach((question) => {
		if (question.type === 'MATRIX' && question.ratingConfig?.rows) {
			// Добавляем заголовки строк для матричных вопросов
			headers.push(
				...question.ratingConfig.rows.map((row) =>
					`${question.text} - ${row}`.replace(/"/g, '""'),
				),
			);
		} else {
			headers.push(formatValueForCsv(question.text));
		}
	});

	return headers;
};

// Генерация значений строки CSV на основе одного ответа
const generateCsvRow = (
	response: SurveyResponse,
	questions: Question[],
	hideUser?: boolean,
): string[] => {
	const row = hideUser
		? [formatValueForCsv(new Date(response.createdAt).toLocaleString())]
		: [
				formatValueForCsv(
					response.user?.name && response.user?.surname
						? `${response.user?.name} ${response.user?.surname}`
						: response.userId,
				),
				formatValueForCsv(new Date(response.createdAt).toLocaleString()),
			];
	questions.forEach((question) => {
		const answer = response?.answers?.find((a) => a.questionId === question.id);

		// Если ответа нет
		if (!answer) {
			if (question.type === 'MATRIX' && question.ratingConfig?.rows) {
				// Для матричных вопросов добавляем пустые значения для строк
				row.push(
					...question.ratingConfig.rows.map(() => formatValueForCsv('')),
				);
			} else {
				row.push(formatValueForCsv(''));
			}
			return;
		}

		// Объединение значения и комментария
		const formatAnswerWithComment = (value: any, comment?: string): string => {
			if (!comment) return String(value);
			return `${String(value)} (комментарий: ${comment})`;
		};

		// Формирование значений для каждого типа вопросов
		if (question.type === 'MATRIX' && question.ratingConfig?.rows) {
			// Обработка специфики матричных вопросов
			question.ratingConfig.rows.forEach((_, rowIndex) => {
				// Значение находится по индексу строки
				const rowValue = answer.value?.[`${rowIndex}`] || '';
				row.push(formatValueForCsv(rowValue));
			});
		} else if (Array.isArray(answer.value)) {
			// Множественные выборы или фото
			const combinedValue = formatAnswerWithComment(
				answer.value.join(', '),
				answer.comment,
			);
			row.push(formatValueForCsv(combinedValue));
		} else {
			// Остальные типы вопросов
			const combinedValue = formatAnswerWithComment(
				answer.value,
				answer.comment,
			);
			row.push(formatValueForCsv(combinedValue));
		}
	});
	return row;
};

// Главная функция экспорта опроса в CSV
export const exportSurveyToCsv = (survey: Survey): void => {
	if (!survey || !survey.questions?.length || !survey.responses?.length) {
		console.error('Нет данных для экспорта');
		return;
	}

	// Генерируем заголовки CSV
	const headers = generateCsvHeaders(
		survey.questions,
		survey.type === 'ANONYMOUS',
	);
	// Генерируем строки данных
	const rows = survey.responses.map((response) =>
		generateCsvRow(
			response,
			survey.questions,
			survey.type === 'ANONYMOUS',
		).join(';'),
	);

	// Содержание CSV (добавляем BOM для корректной кодировки)
	const csvContent = '\uFEFF' + headers.join(';') + '\n' + rows.join('\n');

	// Создаем и скачиваем CSV-файл
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);

	link.setAttribute('href', url);
	link.setAttribute('download', `${survey.title}_results.csv`);
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
		columns.map((col) => `"${col.title.replace(/"/g, '""')}"`).join(';') + '\n';

	// Данные
	data.forEach((row) => {
		const rowValues = columns.map((col) => {
			let value = row[col.key] !== undefined ? row[col.key] : '';
			// Преобразуем null в пустую строку
			if (value === null) value = '';
			return `"${String(value).replace(/"/g, '""')}"`;
		});
		csv += rowValues.join(';') + '\n';
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

export const exportStructureToCsv = (data: any[], fileName: string) => {
	const rows: string[] = [];

	// Заголовки
	const headers = [
		'Название департамента',
		'Название позиции',
		'Имя пользователя',
		'Фамилия пользователя',
		'Телефон пользователя',
		'Внутренний телефон',
		'Email пользователя',
	];
	rows.push(headers.map(formatValueForCsv).join(';'));

	// Рекурсивный обход данных
	data.forEach((department) => {
		department.positions.forEach((position: any) => {
			const tel = position.user?.tel ? `'${position.user.tel}` : '';
			const internalPhone = position.user?.internalPhone
				? `'${position.user.internalPhone}`
				: '';

			const row = [
				department?.title || '',
				position?.title || '',
				position?.user?.name || '',
				position?.user?.surname || '',
				tel,
				internalPhone,
				position?.user?.email || '',
			];
			rows.push(row.map(formatValueForCsv).join(';'));
		});
	});

	// Создание CSV
	const csvContent = '\uFEFF' + rows.join('\n');

	// Сохранение файла
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = fileName;
	link.click();
};
