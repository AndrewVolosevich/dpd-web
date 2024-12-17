// @ts-ignore
import Paragraph from '@editorjs/paragraph';
// @ts-ignore
import Header from '@editorjs/header';
// @ts-ignore
import List from '@editorjs/list';
// @ts-ignore
import LinkTool from '@editorjs/link';
// @ts-ignore
import Delimiter from '@editorjs/delimiter';
// @ts-ignore
// import CheckList from '@editorjs/checklist';
// @ts-ignore
import Embed from '@editorjs/embed';
// @ts-ignore
import Code from '@editorjs/code';
// @ts-ignore
import InlineCode from '@editorjs/inline-code';
// @ts-ignore
import Marker from '@editorjs/marker';
// @ts-ignore
// import ImageTool from '@editorjs/image';

export const getEditorJsTools = (token: string) => {
	return {
		header: {
			class: Header,
			config: {
				placeholder: 'Введите заголовок...',
				levels: [1, 2, 3, 4, 5, 6],
				defaultLevel: 2,
			},
			inlineToolbar: true,
		},
		paragraph: {
			placeholder: 'Добавте текст...',
			class: Paragraph,
			inlineToolbar: true,
		},
		list: List,
		// checkList: CheckList,
		linkTool: {
			placeholder: 'Вставьте ссылку...',
			class: LinkTool,
			config: {
				endpoint: '/api/link',
			},
			inlineToolbar: true,
		},
		delimiter: Delimiter,
		embed: Embed,
		code: Code,
		inlineCode: InlineCode,
		marker: Marker,
		// image: {
		// 	class: ImageTool,
		// 	config: {
		// 		field: 'file',
		// 		additionalRequestHeaders: {
		// 			authorization: `Bearer ${token}`,
		// 		},
		// 		endpoints: {
		// 			byFile: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/upload/device`, // Your backend file uploader endpoint
		// 			byUrl: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/upload/url`, // Your endpoint that provides uploading by Url
		// 		},
		// 	},
		// },
	};
};

export const EDITOR_INITIAL_DATA = {
	time: new Date().getTime(),
	blocks: [],
};
