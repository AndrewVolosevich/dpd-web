'use client';

import CustomCodeRenderer from './OutputRenderers/CustomCodeRenderer';
import CustomImageRenderer from './OutputRenderers/CustomImageRenderer';
import { FC } from 'react';
import dynamic from 'next/dynamic';
import CustomDelimiterRenderer from '@/components/Editor/OutputRenderers/CustomDelimiterRenderer';
import './OutputBlock.css';

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
	paragraph: 'mb-4 text-base',
	header: {
		h1: 'text-4xl font-bold mb-4 text-primary',
		h2: 'text-3xl font-semibold mb-3 text-primary',
		h3: 'text-2xl font-medium mb-2 text-primary',
		h4: 'text-xl mb-1 text-primary',
		h5: 'text-lg',
		h6: 'text-base',
	},
	link: 'underline',
	image: 'my-4 mx-auto max-w-full rounded-lg shadow-lg',
	delimiter: 'my-8 border-t-2 border-gray-300',
};

const OutputBlock: FC<EditorOutputProps> = ({ content }) => {
	return (
		<div className={'output'}>
			<Output
				classNames={customClassNames}
				renderers={renderers}
				data={content}
			/>
		</div>
	);
};

export default OutputBlock;
