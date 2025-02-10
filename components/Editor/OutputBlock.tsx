'use client';

import CustomCodeRenderer from './OutputRenderers/CustomCodeRenderer';
import CustomImageRenderer from './OutputRenderers/CustomImageRenderer';
import { FC } from 'react';
import dynamic from 'next/dynamic';
import CustomDelimiterRenderer from '@/components/Editor/OutputRenderers/CustomDelimiterRenderer';

const Output = dynamic(
	async () => (await import('editorjs-react-renderer')).default,
	{ ssr: false },
);

interface EditorOutputProps {
	content: any;
}

const renderers = {
	image: CustomImageRenderer,
	code: CustomCodeRenderer,
	delimiter: CustomDelimiterRenderer,
};

const customClassNames = {
	paragraph: 'mb-4 text-base text-gray-700',
	header: {
		h1: 'text-4xl font-bold mb-4',
		h2: 'text-3xl font-semibold mb-3',
		h3: 'text-2xl font-medium mb-2',
		h4: 'text-xl mb-1',
		h5: 'text-lg',
		h6: 'text-base',
	},
	link: 'text-blue-600 hover:underline',
	image: 'my-4 mx-auto max-w-full rounded-lg shadow-lg',
	delimiter: 'my-8 border-t-2 border-gray-300',
};

const OutputBlock: FC<EditorOutputProps> = ({ content }) => {
	return (
		<Output
			classNames={customClassNames}
			renderers={renderers}
			data={content}
		/>
	);
};

export default OutputBlock;
