// this file contains help texts and stuff for shortcuts
// does not actually handle any keyboard presses
export const getKeyboardBufferText = (
	x: number,
	y: number,
	buffer: KeyboardBuffer,
	colClueAreaHeight: number
): string => {
	const isFirstCol = x === 0;
	const isLastRow = y === colClueAreaHeight - 1;

	if (!isFirstCol || !isLastRow) {
		return '';
	}

	let text = '';

	if (buffer.repeat > 1) {
		text += buffer.repeat;
	}

	if (buffer.pendingAction) {
		text += getPendingActionLetter(buffer.pendingAction);
	}

	return text;
};

const getPendingActionLetter = (pendingAction: CellState) => {
	switch (pendingAction) {
		case 0:
			return 'S';
		case 1:
			return 'F';
		case 2:
			return 'D';
	}
};

// export const getHelpDialog = (buffer: KeyboardBuffer, currentCellState: CellState) => {
//     return m("div.help", [
//         movementText(buffer),
//         actionText(buffer),
//         m("p.sub", "F = fill cell"),
//         m("p.sub", "D = cross cell"),
//         m("p.sub", "S = clear cell"),
//         appendText(buffer, currentCellState),
//         m("p.divider", "<num> to repeat action"),
//         m("p.sub", "3J = move down 3"),
//         m("p.sub", "3FJ = move down 3 & fill cells"),
//     ])
// }

// const movementText = (buffer: KeyboardBuffer) => {
//     const boldText = buffer.repeat > 1
//     return m("p", { class: boldText ? "bold" : "" }, "[HJKL] to move")
// }

// const actionText = (buffer: KeyboardBuffer) => {
//     const boldText = buffer.repeat > 1 && buffer.pendingAction === null
//     return m("p.divider", { class: boldText ? "bold" : "" }, "[FDS] to change cell")
// }

// // TODO: only bold when just filled in a cell, not when moving to already filled cell!
// const appendText = (buffer: KeyboardBuffer, currentCellState: CellState) => {
//     const boldText = !buffer.appending && currentCellState === 1 // TODO: support other states as well
//     return m("p", { class: boldText ? "bold" : "" }, "[FDS] again to start appending")
// }
