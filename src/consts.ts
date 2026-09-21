// 全站常量。改这里就等于改站点身份，不用去各个页面里翻。

export const SITE_TITLE = 'Stormaker';
/** 一句话简介，会进首页 Hero、<meta description>、RSS 和 OG */
export const SITE_DESCRIPTION = '写代码、做产品，也把踩过的坑写下来。内容以 Serverless、前端工程和 AI 工具为主。';
export const SITE_URL = 'https://stormaker.dev';
/** RSS / 版权署名 */
export const AUTHOR = 'Stormaker';

/** 导航栏链接 */
export const NAV_LINKS = [
	{ href: '/', label: '首页' },
	{ href: '/blog', label: '文章' },
	{ href: '/tags', label: '标签' },
	{ href: '/search', label: '搜索' },
	{ href: '/about', label: '关于' },
] as const;

/** 社交链接，留空字符串即不显示 */
export const SOCIAL = {
	github: 'https://github.com/stormaker',
	x: '',
	mastodon: '',
	email: '',
} as const;

/**
 * Cloudflare Web Analytics 的 token。
 * Dashboard → Analytics & Logs → Web Analytics → 添加站点后拿到，
 * 粘进来即生效；留空则不注入任何统计脚本。
 */
export const CF_ANALYTICS_TOKEN = '';

/** 首页潮汐卡上的「最近在写」 */
export const NOW_WRITING = 'Serverless 与边缘计算';
