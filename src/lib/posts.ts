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
