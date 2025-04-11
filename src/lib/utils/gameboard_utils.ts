export function initializeEmptyBoard(clues: Clues): GameBoard {
	const numRows = clues.left.length;
	const numCols = clues.top.length;
	// Initialize with '0' for empty state
	return Array.from({ length: numRows }, () => Array(numCols).fill(0));
}
