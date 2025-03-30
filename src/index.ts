import m, { Vnode } from 'mithril';
import { getLeftClue, getMaxClueLength, getRelativeLineNumber, getTopClue, initializeEmptyBoard, loop } from './table_utils';
import { getCellCssClass, getCellSize } from './styling_utils';
import { handleKeyPress } from './keyboard_handler';
import { getClueClasses, initCluesWithState } from './clue_util';


const Game = () => {

    const clues: Clues = {
        top: [[1], [2, 3], [4, 1, 1], [1, 3], [1, 1, 1, 2], [1, 1, 2], [4, 1, 1], [1, 1], [1, 1], [5]],
        left: [[3], [1, 1], [1, 1, 1], [3, 1], [5, 1], [1, 1, 1], [1, 4], [1, 1, 1], [1, 2, 2], [2, 3, 1]]
    }

    const cluesWithState: CluesWithState = initCluesWithState(clues)

    const gameHeight = cluesWithState.left.length
    const gameWidth = cluesWithState.top.length

    const rowClueAreaWidth = getMaxClueLength(clues.left)
    const colClueAreaHeight = getMaxClueLength(clues.top)

    // constants might not be needed?
    const constants: GameConstants = {
        cellSize: 25,
        rowClueAreaWidth: rowClueAreaWidth,
        colClueAreaHeight: colClueAreaHeight,
        gameHeight: gameHeight,
        gameWidth: gameWidth
    }

    console.debug("constants: " + constants);


    const playerPosition: PlayerPosition = {
        x: 0,
        y: 0
    }

    const gameBoard: GameBoard = initializeEmptyBoard(clues)

    const keyboardBuffer: KeyboardBuffer = {
        repeat: 1,
        pendingAction: null
    }

    const handleKeypressWrapper = (e: KeyboardEvent) => {
        if (handleKeyPress(e, playerPosition, gameBoard, keyboardBuffer, constants, cluesWithState)) {
            console.debug("Redrawing UI");
            m.redraw()
        }
    }

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
                    m("table.blank", loop(constants.colClueAreaHeight).map(_ =>
                        m("tr.blank", loop(constants.rowClueAreaWidth).map(_ =>
                            m("td.blank", { style: getCellSize(constants.cellSize) })
                        ))
                    )),

                    // Column (top) clues
                    m("table", loop(constants.colClueAreaHeight).map(nthClueFromTop =>
                        m("tr", loop(gameWidth).map(nthClueFromLeft => {

                            const clue = getTopClue(
                                cluesWithState.top,
                                nthClueFromLeft,
                                nthClueFromTop,
                                constants.colClueAreaHeight
                            )

                            return m("td.clue",
                                {
                                    style: getCellSize(constants.cellSize),
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
                    m("table", loop(gameHeight).map(nthClueFromTop =>
                        m("tr", loop(constants.rowClueAreaWidth).map(nthClueFromLeft => {
                            const clue = getLeftClue(
                                cluesWithState.left,
                                nthClueFromLeft,
                                nthClueFromTop,
                                constants.rowClueAreaWidth
                            )

                            return m("td.clue", {
                                style: getCellSize(constants.cellSize),
                                class: getClueClasses(nthClueFromTop, playerPosition.y, clue)
                            },
                                clue?.clue
                            )
                        }

                        ))
                    )),

                    // Play area
                    m("table", loop(gameHeight).map(rowIndex =>
                        m("tr", loop(gameWidth).map(colIndex => {
                            let classes = getCellCssClass(gameBoard, playerPosition, rowIndex, colIndex)

                            return m("td", {
                                style: getCellSize(constants.cellSize),
                                className: classes
                            },
                                // colIndex + "," + rowIndex
                                // cellValue
                            )
                        }))
                    )),

                    // Row line numbers
                    m("table.line-number", loop(gameHeight).map(rowIndex =>
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
                    m("table.blank",
                        m("tr.blank", loop(constants.rowClueAreaWidth).map(_ =>
                            m("td.blank", { style: getCellSize(constants.cellSize) })
                        ))
                    ),

                    // Column line numbers
                    m("table.line-number",
                        m("tr.line-number", loop(gameWidth).map(colIndex =>
                            m("td.line-number.top-align", { style: getCellSize(constants.cellSize), },
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