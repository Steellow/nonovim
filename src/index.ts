import m, { Vnode } from 'mithril';
import { handleKeyPress } from './keyboard_handler';
import { getClueClasses, getLeftClue, getMaxClueLength, getRelativeLineNumber, getTopClue, initCluesWithState } from './clue_utils';
import { getCellClasses, initializeEmptyBoard } from './gameboard_utils';
import { getBlankTable, getCellSize, loop } from './table_utils';


const Game = () => {

    const clues: Clues = {
        top: [[1], [2, 3], [4, 1, 1], [1, 3], [1, 1, 1, 2], [1, 1, 2], [4, 1, 1], [1, 1], [1, 1], [5]],
        left: [[3], [1, 1], [1, 1, 1], [3, 1], [5, 1], [1, 1, 1], [1, 4], [1, 1, 1], [1, 2, 2], [2, 3, 1]]
    }

    const gameBoard: GameBoard = initializeEmptyBoard(clues)
    const cluesWithState: CluesWithState = initCluesWithState(clues)

    // Is constants even necessary?
    const con: GameConstants = {
        rowClueAreaWidth: getMaxClueLength(clues.left),
        colClueAreaHeight: getMaxClueLength(clues.top),
        gameHeight: cluesWithState.left.length,
        gameWidth: cluesWithState.top.length
    }

    console.debug("constants: " + con);

    const playerPosition: PlayerPosition = {
        x: 0,
        y: 0
    }

    const keyboardBuffer: KeyboardBuffer = {
        repeat: 1,
        pendingAction: null
    }

    const handleKeypressWrapper = (e: KeyboardEvent) => {
        if (handleKeyPress(e, playerPosition, gameBoard, keyboardBuffer, con, cluesWithState)) {
            console.debug("Redrawing UI");
            m.redraw()
        }
    }

    const cellSize = getCellSize(25)

    return {

        oncreate: (vnode: Vnode) => {
            document.addEventListener('keydown', handleKeypressWrapper)
            console.log("Keyboard handler added");
        },

        onremove: (vnode: Vnode) => {
            document.removeEventListener('keydown', handleKeypressWrapper)
            console.log("Keyboard listener removed");
        },

        view: (vnode: Vnode) => {

            return m('div', [
                m("div.row", [

                    // Empty space on top left
                    getBlankTable(con.rowClueAreaWidth, con.colClueAreaHeight, cellSize),

                    // Column (top) clues
                    m("table", loop(con.colClueAreaHeight).map(nthClueFromTop =>
                        m("tr", loop(con.gameWidth).map(nthClueFromLeft => {

                            const clue = getTopClue(
                                cluesWithState.top,
                                nthClueFromLeft,
                                nthClueFromTop,
                                con.colClueAreaHeight
                            )

                            return m("td.clue",
                                {
                                    style: cellSize,
                                    class: getClueClasses(nthClueFromLeft, playerPosition.x, clue)
                                },
                                clue?.clue
                            )
                        }

                        ))
                    ))
                ]),

                m("div.row", [

                    // Row (left) clues
                    m("table", loop(con.gameHeight).map(nthClueFromTop =>
                        m("tr", loop(con.rowClueAreaWidth).map(nthClueFromLeft => {
                            const clue = getLeftClue(
                                cluesWithState.left,
                                nthClueFromLeft,
                                nthClueFromTop,
                                con.rowClueAreaWidth
                            )

                            return m("td.clue", {
                                style: cellSize,
                                class: getClueClasses(nthClueFromTop, playerPosition.y, clue)
                            },
                                clue?.clue
                            )
                        }

                        ))
                    )),

                    // Play area
                    m("table", loop(con.gameHeight).map(rowIndex =>
                        m("tr", loop(con.gameWidth).map(colIndex => m("td", {
                            style: cellSize,
                            className: getCellClasses(gameBoard, playerPosition, rowIndex, colIndex)
                        },
                            // colIndex + "," + rowIndex
                        )
                        ))
                    )),

                    // Row line numbers
                    m("table.line-number", loop(con.gameHeight).map(rowIndex =>
                        m("tr.line-number",
                            m("td.line-number",
                                getRelativeLineNumber(rowIndex, playerPosition.y)
                            )
                        )
                    )
                    )
                ]),

                m("div.row", [

                    // Bottom left empty space
                    getBlankTable(con.rowClueAreaWidth, 1, cellSize),

                    // Column line numbers
                    m("table.line-number",
                        m("tr.line-number", loop(con.gameWidth).map(colIndex =>
                            m("td.line-number.top-align", { style: cellSize, },
                                getRelativeLineNumber(colIndex, playerPosition.x)
                            )
                        )
                        )
                    )
                ])
            ])
        }
    }
}

const root = document.getElementById('app');
if (root) {
    m.mount(root, Game)
    console.debug("Mithril app mounted succesfully.")
} else {
    console.error("Root element #app not found!");
}