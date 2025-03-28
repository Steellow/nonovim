import m, { Vnode } from 'mithril';
import { getCellValue, getMaxClueLength, initializeEmptyBoard, loop } from './table_utils';
import { getCellCssClass } from './styling_utils';
import { handleKeyPress } from './keyboard_handler';


const Game = () => {

    // Temp, for game
    const clues: NonogramClues = {
        cols: [[1], [6], [1], [2]],
        rows: [[2], [1], [1], [1], [3], [1, 1]],
    }

    const rowClueAreaWidth = getMaxClueLength(clues.rows)
    const colClueAreaHeight = getMaxClueLength(clues.cols)

    const constants: GameConstants = {
        cellSize: 25,
        rowClueAreaWidth: rowClueAreaWidth,
        colClueAreaHeight: colClueAreaHeight,
        tableTotalWidth: clues.cols.length + rowClueAreaWidth,
        tableTotalHeight: clues.rows.length + colClueAreaHeight,
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
            return m('table', loop(constants.tableTotalHeight).map(rowIndex => {
                return m("tr", loop(constants.tableTotalWidth).map(colIndex => {
                    const cellValue = getCellValue(rowIndex, colIndex, clues, constants, gameBoard)

                    let classes = getCellCssClass(cellValue, gameBoard, playerPosition, rowIndex, colIndex, constants)

                    return m("td.cell", {
                        key: `cell-${rowIndex}-${colIndex}`,
                        class: classes,
                        style: {
                            height: `${constants.cellSize}px`,
                            width: `${constants.cellSize}px`,
                        },
                    },
                        // colIndex + "," + rowIndex
                        cellValue
                    )
                }))
            })
            )
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