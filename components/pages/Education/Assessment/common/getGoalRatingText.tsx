const getGoalRatingText = (value?: number) => {
	switch (value) {
		case 0:
			return 'не выполнена (0)';
		case 1:
			return 'частично выполнена (1)';
		case 2:
			return 'полностью выполнена (2)';
		case 3:
			return 'выполнена с превышением (3)';
		default:
			return 'не оценена';
	}
};

export default getGoalRatingText;
