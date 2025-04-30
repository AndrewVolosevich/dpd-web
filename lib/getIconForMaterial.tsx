import {
	File,
	FileText,
	Headphones,
	Link as LinkIcon,
	Monitor,
	Video,
} from 'lucide-react';

export const getFileExtension = (url?: string | null) => {
	if (url === null) return 'link';

	return url?.split('.')?.pop()?.toLowerCase() || '';
};

export const getIconForMaterial = (materialUrl?: string, isUrl?: boolean) => {
	// Извлечение расширения файла из URL
	const fileExtension = getFileExtension(materialUrl);
	if (isUrl) {
		return <LinkIcon className="h-5 w-5" />;
	}

	switch (fileExtension) {
		case 'pdf':
		case 'doc':
		case 'docx':
		case 'txt':
			return <FileText className="h-5 w-5" />;
		case 'ppt':
		case 'pptx':
			return <Monitor className="h-5 w-5" />;
		case 'mp4':
		case 'avi':
		case 'mov':
			return <Video className="h-5 w-5" />;
		case 'mp3':
		case 'wav':
			return <Headphones className="h-5 w-5" />;
		default:
			return <File className="h-5 w-5" />;
	}
};
