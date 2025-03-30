export const getGameboardColumnStatesAsArray = (gameBoard: CellState[][], xPosition: number): CellState[] => {
    return gameBoard.map(row =>
        row[xPosition]
    )
}