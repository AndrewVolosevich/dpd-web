export const getFileNameFromUrl = (url?: string) => {
	return url?.split('/')?.pop()?.split('.')[0] || '';
};
