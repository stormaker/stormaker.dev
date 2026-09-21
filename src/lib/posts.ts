import { type CollectionEntry, getCollection } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/**
 * 已发布文章，按时间倒序。
 * dev 下草稿可见，生产构建里 draft: true 的文章不会被渲染、
 * 也不会进 sitemap / RSS / 标签页 —— 唯一入口就是这个函数。
 */
export async function getPublishedPosts(): Promise<Post[]> {
	const posts = await getCollection(
		'blog',
		({ data }) => import.meta.env.DEV || data.draft !== true,
	);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** 标签 → 文章数，按文章数倒序 */
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
	const posts = await getPublishedPosts();
	const counts = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.data.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}
	return [...counts.entries()]
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * 预计阅读分钟数：中文按 400 字/分钟，英文单词按 200 词/分钟。
 * 代码块不计入 —— 代码是扫读的，按字数算会严重高估。
 */
export function readingMinutes(body = ''): number {
	const text = body.replace(/```[\s\S]*?```/g, '');
	const cjk = (text.match(/[㐀-鿿]/g) ?? []).length;
	const words = (text.replace(/[㐀-鿿]/g, ' ').match(/[A-Za-z0-9]+/g) ?? []).length;
	return Math.max(1, Math.round(cjk / 400 + words / 200));
}

/** 时间上相邻的两篇：prev 更早，next 更新 */
export function adjacent(posts: Post[], id: string): { prev?: Post; next?: Post } {
	const i = posts.findIndex((p) => p.id === id);
	if (i === -1) return {};
	return { prev: posts[i + 1], next: posts[i - 1] };
}

/** 按年份分组，年份倒序 */
export function groupByYear(posts: Post[]): [number, Post[]][] {
	const map = new Map<number, Post[]>();
	for (const post of posts) {
		const y = post.data.pubDate.getUTCFullYear();
		map.set(y, [...(map.get(y) ?? []), post]);
	}
	return [...map.entries()].sort((a, b) => b[0] - a[0]);
}
