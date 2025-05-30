'use client';
import React from 'react';
import ContentPage from '@/components/pages/About/SubPages/ContentPage';

const CompanyInfoPage = () => {
	return (
		<div className="flex-grow container mx-auto px-4 py-8">
			<ContentPage contentPageTitle={'company-info'} />
		</div>
	);
};

export default CompanyInfoPage;
