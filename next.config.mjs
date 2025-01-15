/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		dangerouslyAllowSVG: true,
		domains: ['placehold.co', 'storage-203.s3hoster.by'],
	},
	staticPageGenerationTimeout: 120,
};

export default nextConfig;
