import { formatValueForCsv } from '@/lib/exportToCsv';
import { Assessment } from '@/types/assessment';
import getAssessmentStatusText from '@/components/pages/Education/Assessment/common/getAssessmentStatusText';
import getAssessmentTypeText from '@/components/pages/Education/Assessment/common/getAssessmentTypeText';

// Экспорт общего отчета по ежегодной оценке, сгруппированного по подразделениям
export const exportGeneralAssessmentGroupedByDepartment = (
	assessments?: Assessment[], // Массив данных сотрудников
	userDepartmentId?: string, // ID текущего пользователя (если нужно фильтровать подчиненных)
) => {
	if (!assessments || !assessments.length) {
		return;
	}

	const rows: string[] = [];
	const visibleDepartments = new Map();

	// Фильтруем данные для руководителя (если задан userDepartmentId)
	const filteredAssessments = userDepartmentId
		? assessments.filter(
				(assessment) => assessment?.user?.departmentId === userDepartmentId,
			)
		: assessments;

	// Группировка данных по департаментам
	filteredAssessments.forEach((assessment) => {
		const department = assessment.user?.departmentId;
		const departmentName = assessment.user?.department?.title || 'Не указано';
		if (!visibleDepartments.has(department)) {
			visibleDepartments.set(department, departmentName);
		}
	});

	// Генерируем строки для каждого департамента
	visibleDepartments.forEach((departmentName, departmentId) => {
		// Добавляем название подразделения как заголовок блока
		rows.push(
			[`Подразделение: ${departmentName}`].map(formatValueForCsv).join(','),
		);

		// Добавляем заголовки колонок
		rows.push(
			[
				'ФИО сотрудника',
				'Название должности',
				'Вид оценки (полная, упрощенная)',
				'Этап оценки',
				'Итоговый балл',
				'Уровень проф.мастерства',
				'Заключение рук-ля (мотивация)',
				'Заключение рук-ля (кадровый резерв)',
				'Заключение рук-ля (зоны для развития)',
			]
				.map(formatValueForCsv)
				.join(','),
		);

		const getFinalScore = (assessment: Assessment) => {
			if (assessment.type === 'FULL') {
				return (
					(
						((assessment?.averageCompetencySupervisor || 0) +
							(assessment?.averageLastYearSupervisor || 0)) /
						2
					).toFixed(2) || 'нет'
				);
			} else {
				return 'нет';
			}
		};

		// Добавляем данных сотрудников из текущего подразделения
		filteredAssessments
			.filter((assessment) => assessment.user?.departmentId === departmentId)
			.forEach((assessment) => {
				rows.push(
					[
						`${assessment.user?.surname} ${assessment.user?.name} ${assessment.user?.patronymic}`,
						assessment.user?.position?.title || 'Не указана',
						getAssessmentTypeText(assessment.type),
						getAssessmentStatusText(assessment.status),
						getFinalScore(assessment),
						`${assessment.averageMasterySupervisor || 'Нет данных'}`,
						assessment?.recommendations?.find(
							(r: any) => r.title === 'Уровень мотивации',
						)?.recommendation || 'Нет данных',
						assessment?.recommendations?.find(
							(r: any) => r.title === 'Кадровый резерв',
						)?.recommendation || 'Нет данных',
						assessment?.recommendations?.find(
							(r: any) => r.title === 'Темы для обучения',
						)?.recommendation || 'Нет данных',
					]
						.map(formatValueForCsv)
						.join(','),
				);
			});

		// Добавляем разделитель между подразделениями
		rows.push('');
	});

	// Генерация CSV-файла
	const csvContent = '\uFEFF' + rows.join('\n');
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');
	link.setAttribute('href', URL.createObjectURL(blob));
	link.setAttribute('download', 'assessments.csv');
	link.style.visibility = 'hidden';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
