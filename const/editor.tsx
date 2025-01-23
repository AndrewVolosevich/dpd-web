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
import ImageTool from '@editorjs/image';

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
		image: {
			class: ImageTool,
			config: {
				field: 'file',
				additionalRequestHeaders: {
					authorization: `Bearer ${token}`,
				},
				endpoints: {
					byFile: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/upload/device`, // Your backend file uploader endpoint
					byUrl: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/upload/url`, // Your endpoint that provides uploading by Url
				},
			},
		},
	};
};

export const EDITOR_INITIAL_DATA = {
	time: new Date().getTime(),
	blocks: [],
};

export const EDITOR_NEW_DATA = {
	time: new Date().getTime(),
	blocks: [
		{
			type: 'header',
			data: {
				text: 'Добро пожаловать в команду!',
				level: 2,
			},
		},
		{
			type: 'paragraph',
			data: {
				text: 'Коллеги, рады вам сообщить, что к команде филиала <mark class="cdx-marker">г. Минск</mark>&nbsp;на должность <mark class="cdx-marker">в роли начальника терминала</mark> присоединился <mark class="cdx-marker">Иванов Иван Иванович</mark>.',
			},
		},
		{
			type: 'delimiter',
			data: {},
		},
		{
			type: 'header',
			data: {
				text: '<mark class="cdx-marker">Иванов Иван Иванович&nbsp;</mark>',
				level: 3,
			},
		},
		{
			type: 'paragraph',
			data: {
				text: '<mark class="cdx-marker">Начальник терминала&nbsp;</mark>&nbsp;',
			},
		},
		{
			type: 'paragraph',
			data: {
				text: '<mark class="cdx-marker">Филиал г. Минск&nbsp;<br></mark>',
			},
		},
		{
			type: 'delimiter',
			data: {},
		},
		{
			type: 'paragraph',
			data: {
				text: 'Иван начал свой путь в компании DPD в октябре 2012 года в качестве начальника сектора сортировки филиала в г. Минск. Летом этого года он принял решение сменить место работы и попробовать себя в другой сфере. Однако в ноябре руководством DPD было принято решение внести изменения в структуру филиала и создать должность начальника терминала. На эту роль и пригласили Ивана как опытного и ответственного сотрудника, заслужившего доверие за долгие годы работы. Приход Ивана обещает принести новые подходы в работе, что, безусловно, положительно скажется на динамике развития подразделения. Его профессионализм, целеустремленность и преданности ценностям компании помогут добиться успеха в новой роли и благоприятно повлияют на результаты деятельности филиала.&nbsp;',
			},
		},
		{
			type: 'paragraph',
			data: {
				text: '<mark class="cdx-marker">Иван</mark> будет отвечать за:&nbsp;',
			},
		},
		{
			type: 'list',
			data: {
				style: 'unordered',
				items: [
					'Осуществление руководства деятельностью терминала филиала в г. Минск.&nbsp;',
				],
			},
		},
		{
			type: 'list',
			data: {
				style: 'unordered',
				items: [
					'Контроль деятельности специалиста по приему и обработке грузов в мини сити-депо г. Минск.&nbsp;&nbsp;',
				],
			},
		},
		{
			type: 'list',
			data: {
				style: 'unordered',
				items: [
					'Учет результатов работы подразделения, ведение и своевременное представление установленной отчетности.&nbsp;',
				],
			},
		},
		{
			type: 'list',
			data: {
				style: 'unordered',
				items: [
					'Организацию приема/выдачи грузов на терминале водителям для доставки или представителям клиентов.&nbsp;&nbsp;',
				],
			},
		},
		{
			type: 'paragraph',
			data: {
				text: 'Рабочий телефон: <mark class="cdx-marker">123-123-123</mark>',
			},
		},
		{
			type: 'paragraph',
			data: {
				text: '<mark class="cdx-marker">Иван</mark>, добро пожаловать в команду, желаем успехов и удачи!&nbsp;',
			},
		},
	],
	version: '2.30.7',
};

export const EDITOR_TRANSFER_DATA = {
	time: 1737663871416,
	blocks: [
		{
			type: 'header',
			data: {
				text: 'Добро пожаловать в команду!',
				level: 2,
			},
		},
		{
			type: 'paragraph',
			data: {
				text: 'Коллеги, рады вам сообщить, что в секторе сортировки терминала в г. Минске произошли кадровые перестановки. Иванов Иван переведен на должность начальника смены.&nbsp;',
			},
		},
		{
			type: 'delimiter',
			data: {},
		},
		{
			type: 'header',
			data: {
				text: '<mark class="cdx-marker">Иванов Иван Иванович&nbsp;</mark>',
				level: 3,
			},
		},
		{
			type: 'paragraph',
			data: {
				text: '<mark class="cdx-marker">Начальник смены&nbsp;</mark>&nbsp;',
			},
		},
		{
			type: 'paragraph',
			data: {
				text: '<mark class="cdx-marker">Филиал г. Минск&nbsp;<br></mark>',
			},
		},
		{
			type: 'delimiter',
			data: {},
		},
		{
			type: 'paragraph',
			data: {
				text: 'Иван стал частью команды DPD в сентябре 2022 года и был принят на должность оператора сектора сортировки. За короткое время он смог проявить себя как ответственный и исполнительный сотрудник. После чего Иван был переведен на должность старшего оператора, а с 1 ноября 2024 года назначен на должность начальника смены сектора сортировки терминала в г. Минске с расширением зоны ответственности и полномочий. ',
			},
		},
		{
			type: 'paragraph',
			data: {
				text: '<mark class="cdx-marker">Иван</mark> будет отвечать за:&nbsp;',
			},
		},
		{
			type: 'list',
			data: {
				style: 'unordered',
				items: [
					'Организацию работы смены операторов сектора сортировки.&nbsp;&nbsp;',
				],
			},
		},
		{
			type: 'list',
			data: {
				style: 'unordered',
				items: ['Документооборот и отчетность на смене.&nbsp;'],
			},
		},
		{
			type: 'list',
			data: {
				style: 'unordered',
				items: [
					'Обеспечение качества приемки, сортировки и отправки грузов сменой, организацию обучения новых сотрудников.&nbsp;',
				],
			},
		},
		{
			type: 'paragraph',
			data: {
				text: 'Рабочий телефон: <mark class="cdx-marker">123-123-123</mark>',
			},
		},
		{
			type: 'paragraph',
			data: {
				text: '<mark class="cdx-marker">Иван</mark>, желаем быстрой адаптации в новой должности и надеемся на успешное и плодотворное сотрудничество!&nbsp;',
			},
		},
	],
	version: '2.30.7',
};
