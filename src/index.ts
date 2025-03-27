import m from 'mithril'; // Import Mithril
import { getClue, getMaxClueLength, initializeEmptyBoard, isBlankCell, isFocusedCell, loop } from './table_utils';
import { getCellCssClass } from './styling_utils';


const Game: m.Component<{}, GameState> = {

    oninit: function (vnode) {
        // Temp, for game
        const clues: NonogramClues = {
            cols: [[1], [6], [1], [2]],
            rows: [[2], [1], [1], [1], [3], [1, 1]],
        }

        const rowClueAreaWidth = getMaxClueLength(clues.rows)
        const colClueAreaHeight = getMaxClueLength(clues.cols)

        vnode.state.clues = clues
        vnode.state.x = 0
        vnode.state.y = 0
        vnode.state.gameBoard = initializeEmptyBoard(clues)
        vnode.state.constants = {
            cellSize: 50,
            rowClueAreaWidth: rowClueAreaWidth,
            colClueAreaHeight: colClueAreaHeight,
            tableTotalHeight: clues.rows.length + colClueAreaHeight,
            tableTotalWidth: clues.cols.length + rowClueAreaWidth
        }

        console.log("Game component initialized. State:", vnode.state);
    },

    view: function (vnode) {
        const { clues, gameBoard, x, y, constants } = vnode.state;
        const { cellSize, rowClueAreaWidth, colClueAreaHeight, tableTotalHeight, tableTotalWidth } = constants

        return m('table', loop(constants.tableTotalHeight).map(rowIndex => {
            return m("tr", loop(constants.tableTotalWidth).map(colIndex => {
                const isBlank = isBlankCell(rowIndex, colIndex, rowClueAreaWidth, colClueAreaHeight);
                const isFocused = isFocusedCell(rowIndex, colIndex, x, y, clues, rowClueAreaWidth, colClueAreaHeight)

                const clueValue = getClue(rowIndex, colIndex, clues, rowClueAreaWidth, colClueAreaHeight);

                let cellTypeClass = getCellCssClass(isBlank, isFocused, clueValue)

                return m("td.cell", {
                    key: `cell-${rowIndex}-${colIndex}`,
                    class: cellTypeClass,
                    style: {
                        height: `${constants.cellSize}px`,
                        width: `${constants.cellSize}px`,
                    },
                },
                    // colIndex + "," + rowIndex
                    clueValue
                )
            }))
        })
        )

    }
};

// Find the root element in index.html
const root = document.getElementById('app');

// Mount the TableComponent onto the root element, passing attributes
if (root) {
    m.mount(root, {
        view: () => m(Game)
    });
} else {
    console.error("Root element #app not found!");
}