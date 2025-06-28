/** @type {import("next-sitemap").IConfig} */
module.exports =
	{
		siteUrl : "https://tfc-calculator.devmarcel.net/",
		generateRobotsTxt : true,
		robotsTxtOptions: {
			policies : [
				{
					userAgent : 'googleBot',
					allow : '/',
				},
				{
					userAgent : '*',
					allow : '/',
				},
			],
		},
		changefreq : "weekly",
		priority : 0.7,
		sitemapSize : 5000,
	};
