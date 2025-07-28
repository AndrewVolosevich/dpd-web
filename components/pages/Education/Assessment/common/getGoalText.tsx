import { Goal, GoalType } from '@/types/assessment';

const getGoalText = (goal?: Goal) => {
	switch (goal?.type) {
		case GoalType.PLANNED:
			return 'Запланированная';
		case GoalType.REMOVED:
			return 'Снята';
		default:
			return 'Нет информации';
	}
};

export default getGoalText;
