// 全站常量。改这里就等于改站点身份，不用去各个页面里翻。

/** TODO: 换成你自己的站点名 */
export const SITE_TITLE = 'Stormaker';
/** TODO: 换成你自己的一句话简介，会进 <meta description> / RSS / OG */
export const SITE_DESCRIPTION = '技术笔记占位描述，待替换。';
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

/** 首页潮汐卡上的「最近在写」。TODO: 换成你正在写的方向 */
export const NOW_WRITING = 'Serverless 与边缘计算';
