import m, { Vnode } from 'mithril';
import { getLeftClue, getMaxClueLength, getTopClue, initializeEmptyBoard, loop } from './table_utils';
import { getCellCssClass, getCellSize } from './styling_utils';
import { handleKeyPress } from './keyboard_handler';


const Game = () => {

    // Temp, for game
    const clues: NonogramClues = {
        top: [[1], [6], [1], [2]],
        left: [[2], [1], [1], [1], [3], [1, 1]],
    }

    const rowClueAreaWidth = getMaxClueLength(clues.left)
    const colClueAreaHeight = getMaxClueLength(clues.top)

    const constants: GameConstants = {
        cellSize: 25,
        rowClueAreaWidth: rowClueAreaWidth,
        colClueAreaHeight: colClueAreaHeight,
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
        if (handleKeyPress(e, playerPosition, gameBoard, keyboardBuffer, constants)) {
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
                        m("tr", loop(clues.top.length).map(nthClueFromLeft =>
                            m("td.clue", { style: getCellSize(constants.cellSize) },
                                getTopClue(
                                    clues.top,
                                    nthClueFromLeft,
                                    nthClueFromTop,
                                )
                            )
                        ))
                    ))
                ]),

                m("div.row", [

                    // Row (left) clues
                    m("table", loop(clues.left.length).map(nthClueFromTop =>
                        m("tr", loop(constants.rowClueAreaWidth).map(nthClueFromLeft =>
                            m("td.clue", { style: getCellSize(constants.cellSize) },
                                getLeftClue(
                                    clues.left,
                                    nthClueFromLeft,
                                    nthClueFromTop,
                                    constants.rowClueAreaWidth
                                )
                            )
                        ))
                    )),

                    // Play area
                    m("table", loop(clues.left.length).map(rowIndex =>
                        m("tr", loop(clues.top.length).map(colIndex => {
                            let classes = getCellCssClass(gameBoard, playerPosition, rowIndex, colIndex)

                            return m("td", {
                                style: getCellSize(constants.cellSize),
                                className: classes
                            },
                                // colIndex + "," + rowIndex
                                // cellValue
                            )
                        }))
                    ))

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