export function loop(num: number): number[] {
	return Array.from({ length: num }, (_, i) => i);
}

export const getCellSize = (size: number) => ({ height: `${size}px`, width: `${size}px` });
