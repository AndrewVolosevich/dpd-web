import { UserData } from '@/types/entities';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function groupUsersByBirthday(
	users?: UserData[],
): Record<string, UserData[]> {
	if (!users) {
		return {};
	}
	return users.reduce(
		(acc, user) => {
			if (user?.bornDate) {
				const formattedDate = format(user?.bornDate, 'd MMMM', { locale: ru });
				if (!acc[formattedDate]) {
					acc[formattedDate] = [];
				}
				acc[formattedDate].push(user);
			}
			return acc;
		},
		{} as Record<string, UserData[]>,
	);
}

export function getStartDateISO(date: Date | undefined): string | undefined {
	return date
		? new Date(
				Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
			).toISOString()
		: undefined;
}

export const formatBornDate = (dateString: string) => {
	return format(new Date(dateString), 'dd MMMM', { locale: ru });
};
