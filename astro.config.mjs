// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://stormaker.dev',
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			// 代码块永远是深海底色，不随明暗主题切换，所以只用一个暗色主题
			theme: 'github-dark-dimmed',
			wrap: true,
		},
	},
	// 构建时从 Google Fonts 下载并随站点自托管，运行时不请求第三方。
	// 只取拉丁子集：中文走系统苹方 / 思源，CJK 网络字体动辄数 MB，不值得。
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Instrument Serif',
			cssVariable: '--font-serif',
			weights: [400],
			styles: ['normal', 'italic'],
			subsets: ['latin'],
			fallbacks: ['Georgia', 'serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'JetBrains Mono',
			cssVariable: '--font-mono',
			weights: [400, 600],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
		},
	],
});
