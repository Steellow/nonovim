import m from 'mithril'; // Import Mithril
import { getClue, getMaxClueLength, getTableTotalHeight, getTableTotalWidth, initializeEmptyBoard, isBlankCell, isFocusedCell, loop } from './board_utils';


const Game: m.Component<{}, GameState> = {

    oninit: function (vnode) {
        // Temp, for game
        const clues: NonogramClues = {
            cols: [[1], [6], [1], [2]],
            rows: [[2], [1], [1], [1], [3], [1, 1]],
        }

        vnode.state.clues = clues
        vnode.state.x = 0
        vnode.state.y = 0
        vnode.state.game = initializeEmptyBoard(clues)
        vnode.state.cellSize = 50

        // TODO: Calculate static variables which never change during the game
        // like tableTotalHeight and maxClues

        console.log("Game component initialized. State:", vnode.state);
    },

    view: function (vnode) {

        const { clues, game, cellSize, x, y } = vnode.state;

        return m('table', loop(getTableTotalHeight(clues)).map(rowIndex => {
            return m("tr", loop(getTableTotalWidth(clues)).map(colIndex => {
                const isBlank = isBlankCell(rowIndex, colIndex, clues);
                const clueValue = getClue(rowIndex, colIndex, clues);
                const isFocused = isFocusedCell(rowIndex, colIndex, x, y, clues)

                let cellTypeClass = '';

                if (isBlank) {
                    cellTypeClass = 'blank';
                } else if (clueValue !== null) {
                    cellTypeClass = 'clue';
                } else if (isFocused) {
                    cellTypeClass = 'focused'
                }

                return m("td.cell", {
                    key: `cell-${rowIndex}-${colIndex}`,
                    class: cellTypeClass,
                    style: {
                        height: `${cellSize}px`,
                        width: `${cellSize}px`,
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