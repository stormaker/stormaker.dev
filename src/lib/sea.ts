/**
 * 构建期生成的海洋装饰：等深线与潮汐浪。
 * 纯函数，输出 SVG path 字符串，不产生任何运行时 JS。
 */

/** 一圈带正弦扰动的闭合等深线 */
function contour(cx: number, cy: number, r: number, k: number, seed: number): string {
	const pts: string[] = [];
	for (let deg = 0; deg <= 360; deg += 6) {
		const a = (deg * Math.PI) / 180;
		const rr =
			r *
			(1 + 0.09 * Math.sin(3 * a + seed) + 0.05 * Math.sin(5 * a + seed * 1.7) + 0.03 * Math.sin(8 * a + k));
		pts.push(`${(cx + rr * Math.cos(a) * 1.35).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`);
	}
	return `M${pts[0]} ${pts.slice(1).map((p) => `L${p}`).join(' ')} Z`;
}

/** Hero 背景的 13 圈等深线；每第 4 圈加粗，像海图上的主等深线 */
export const contourRings = Array.from({ length: 13 }, (_, i) => ({
	d: contour(560, 300, 28 + i * 24, i, 0.6 + i * 0.07),
	width: i % 4 === 0 ? 1.4 : 0.8,
}));

/** 宽度为视口两倍的周期浪，配合 translateX(-50%) 无缝循环 */
export function wavePath(y: number, amp: number, period: number): string {
	const segs: string[] = [];
	for (let x = 0; x < 1200; x += period) {
		segs.push(`Q${x + period / 4} ${y - amp} ${x + period / 2} ${y} T${x + period} ${y}`);
	}
	return `M0 ${y} ${segs.join(' ')} V120 H0Z`;
}
