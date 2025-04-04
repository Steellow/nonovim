import m, { Vnode } from 'mithril';
import { handleKeyPress } from './keyboard_handler';
import { getClueClasses, getLeftClue, getMaxClueLength, getRelativeLineNumber, getTopClue, initCluesWithState } from './clue_utils';
import { getAppendNumbers, getCellClasses, getCellStateUnderCursor, initializeEmptyBoard } from './gameboard_utils';
import { getCellSize, loop } from './table_utils';
import { getHelpDialog, getKeyboardBufferText } from './keyboard_helper_utils';


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
        pendingAction: null,
        appending: false, // support other types as well
    }

    const handleKeypressWrapper = (e: KeyboardEvent) => {
        handleKeyPress(e, playerPosition, gameBoard, keyboardBuffer, con, cluesWithState)
        console.debug("Redrawing UI");
        m.redraw()
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
                    m("table.blank", loop(con.colClueAreaHeight).map(y =>
                        m("tr.blank", loop(con.rowClueAreaWidth).map(x => {
                            const isFirstCol = x === 0
                            const isLastRow = y === con.colClueAreaHeight - 1

                            const bufferText = isFirstCol && isLastRow ? getKeyboardBufferText(keyboardBuffer) : ""

                            return m(
                                "td.blank",
                                {
                                    style: cellSize,
                                },
                                m("div.keyboard-buffer-text", bufferText)
                            )
                        }
                        ))
                    )),

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
                    m("table", loop(con.gameHeight).map(tableY =>
                        m("tr", loop(con.gameWidth).map(tableX => {
                            const appendNumber = getAppendNumbers(playerPosition, tableY, tableX, keyboardBuffer.appendingDirection)

                            return m("td", {
                                style: cellSize,
                                class: getCellClasses(
                                    gameBoard,
                                    playerPosition,
                                    tableY,
                                    tableX,
                                    keyboardBuffer,
                                    appendNumber
                                )
                            },
                                // colIndex + "," + rowIndex
                                appendNumber
                            )
                        }
                        ))
                    )),

                    // Row line numbers
                    m("table.line-number", loop(con.gameHeight).map(rowIndex =>
                        m("tr.line-number",
                            m("td.line-number",
                                getRelativeLineNumber(rowIndex, playerPosition.y)
                            )
                        )
                    ),
                    ),

                    // Help dialog
                    getHelpDialog(
                        keyboardBuffer,
                        getCellStateUnderCursor(playerPosition, gameBoard)
                    )
                ]),

                m("div.row", [

                    // Bottom left empty space
                    m("table.blank",
                        m("tr.blank", loop(con.rowClueAreaWidth).map(_ =>
                            m("td.blank", { style: cellSize })
                        ))
                    ),

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