import React, { memo, useCallback, useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import { getEditorJsTools } from '@/const/editor';
import { clsx } from 'clsx';
import { useAuth } from '@/components/providers/global/AuthProvider';
import './EditorBlock.css';

interface EditorBlockProps extends React.HTMLAttributes<HTMLDivElement> {
	data: any;
	clearCounter?: number;
	renderCounter?: number;
	renderData?: any;
	editorBlockId: string;
	onChange: React.Dispatch<any>;
}

const EditorBlock = ({
	data,
	clearCounter,
	renderCounter,
	renderData,
	onChange,
	editorBlockId,
	className,
	...props
}: EditorBlockProps) => {
	const ejInstance = useRef<EditorJS | null>(null);
	const isReady = useRef(false);
	const { token } = useAuth();
	const tools = getEditorJsTools(token);

	//Initialize editorjs
	const initEditor = useCallback(() => {
		const editor = new EditorJS({
			holder: editorBlockId,
			// @ts-expect-error any
			logLevel: 'ERROR',
			data,
			hideToolbar: false,
			minHeight: 50,
			autofocus: false,
			inlineToolbar: true,
			// @ts-expect-error any
			tools,
			placeholder: 'Нажми "Tab" или кликни для начала...',
			onReady: () => {
				ejInstance.current = editor;
				// plus and tunes buttons should be always on the left
				// @ts-expect-error any
				editor?.ui?.nodes?.wrapper?.classList?.remove('codex-editor--narrow');
			},
			onChange: async (api) => {
				const data = await api.saver.save();
				onChange(data);
			},
		});
	}, [data]);
	useEffect(() => {
		//Initialize editorjs if we don't have a reference
		if (!ejInstance.current && !isReady.current) {
			initEditor();
			isReady.current = true;
		}

		return () => {
			ejInstance?.current?.destroy();
			ejInstance.current = null;
		};
	}, []);

	useEffect(() => {
		if (ejInstance.current && clearCounter) {
			ejInstance.current?.clear();
		}
	}, [clearCounter]);

	useEffect(() => {
		if (ejInstance.current && renderData && renderCounter) {
			ejInstance.current?.render(renderData);
		}
	}, [renderCounter]);
	return (
		<div className={clsx('editor', className)} {...props}>
			<div id={editorBlockId} />
		</div>
	);
};

export default memo(EditorBlock);
