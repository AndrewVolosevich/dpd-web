/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		dangerouslyAllowSVG: true,
		domains: ['placehold.co'],
	},
	staticPageGenerationTimeout: 120,
};

export default nextConfig;
