import React from 'react';

interface DelimiterBlockProps {
	data: {
		style?: 'star' | 'dash' | 'line';
		lineWidth?: number;
		lineThickness?: number;
	};
}

const CustomDelimiterRenderer: React.FC<DelimiterBlockProps> = ({ data }) => {
	const { style = 'star', lineWidth = 25, lineThickness = 2 } = data;

	const getDelimiterElement = () => {
		switch (style) {
			case 'star':
				return <span style={{ fontSize: `${lineWidth}px` }}>★</span>;
			case 'dash':
				return (
					<div
						style={{
							width: `${lineWidth}px`,
							height: `${lineThickness}px`,
							backgroundColor: 'black',
							margin: '10px auto',
						}}
					/>
				);
			case 'line':
				return (
					<div
						style={{
							width: `${lineWidth}%`,
							height: `${lineThickness}px`,
							backgroundColor: 'black',
							margin: '10px auto',
						}}
					/>
				);
			default:
				return <hr />;
		}
	};

	return (
		<div style={{ textAlign: 'center', margin: '20px 0' }}>
			{getDelimiterElement()}
		</div>
	);
};

export default CustomDelimiterRenderer;
