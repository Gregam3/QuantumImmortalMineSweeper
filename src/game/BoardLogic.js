const indexes = [-1, 0, 1];

const permutations = indexes.flatMap(i => indexes.map(i1 => [i, i1]));

export function generateMines(bombPercentage, rows, cols) {
	let mines = generate2DArray(rows, cols, () => Math.random() < bombPercentage / 100);
	let cells = generate2DArray(rows, cols, () => [0, false]);

	for (let r = 0; r <= rows - 1; r++) {
		for (let c = 0; c <= cols - 1; c++) {
			let mineIndicator = -1;

			if (!mines[r][c]) {
				mineIndicator = 0;
				permutations.forEach(p => mineIndicator += safeGrid(r + p[0], c + p[1]));
			}

			cells[r][c] = {
				visible: false,
				flagged: false,
				cellContent: mineIndicator,
				row: r,
				col: c
			};
		}
	}

	console.debug(cells.flatMap(r => r.filter(c => c.cellContent === -1)).length === 0)
	if(cells.flatMap(r => r.filter(c => c.cellContent === -1)).length === 0) return generateMines(bombPercentage, rows, cols);

	return cells;

	function safeGrid(row, column) {
		return (row < 0 || row >= rows || column < 0 || column >= cols) ? false : mines[row][column];
	}
}

function generate2DArray(rowCount, columnCount, fillFun) {
	return Array.from({length: rowCount}, () =>
		Array.from({length: columnCount}, () => fillFun.apply())
	);
}

export function getMines(rows) {
	let minePositions = [];

	rows.forEach(r => r.forEach(c => {
		if (c.cellContent === -1) minePositions.push(c);
	}));

	return minePositions;
};

export function getFlags(rows) {
	let flagPositions = [];

	rows.forEach(r => r.forEach(c => {
		if (c.flagged) flagPositions.push(c);
	}));

	return flagPositions;
};

export function isSolvable(rows) {
	const visibleCells = rows.flatMap(c => c.filter(cell => cell.visible));
	const visibleSurroundingCells = visibleCells.filter(cell => cell.cellContent > 0);

	if (!visibleSurroundingCells.length) return false;

	// console.debug('Visible Surrounding Cells', visibleSurroundingCells);

	const cellsToCheck = Array.from(new Set(visibleSurroundingCells.flatMap(c => getVisibleSurroundingCells(rows, c.row, c.col))
		.filter(cell => Object.keys(cell).length !== 0 && getSurroundingCellCount(rows, cell.row, cell.col) > getSurroundingVisibleCount(rows, cell.row, cell.col))));

	console.debug('Cells to check', cellsToCheck);

	if (cellsToCheck.map(c => {
		if (c.cellContent  - getSurroundingFlagCount(rows, c.row, c.col) === getSurroundingCellCount(rows, c.row, c.col) - getSurroundingVisibleCount(rows, c.row, c.col) &&
			c.cellContent - getSurroundingFlagCount(rows, c.row, c.col) > 0)
			console.debug('Solvable cell - ' + c.row + ":" + c.col);
		return c.cellContent - getSurroundingFlagCount(rows, c.row, c.col) === getSurroundingCellCount(rows, c.row, c.col) - getSurroundingVisibleCount(rows, c.row, c.col) &&
			c.cellContent - getSurroundingFlagCount(rows, c.row, c.col) > 0
	}).indexOf(true) >= 0) return true;

	return visibleCells.filter(c => c.cellContent > 0).map(c => {
		return c.cellContent === getSurroundingFlagCount(rows, c.row, c.col) &&
			getSurroundingCellCount(rows, c.row, c.col) > getSurroundingVisibleCount(rows, c.row, c.col) + getSurroundingFlagCount(rows, c.row, c.col)
	}).indexOf(true) >= 0;
}

function getSurroundingCellCount(rows, row, col) {
	let surroundingCells = 0;
	permutations.forEach(p => surroundingCells += Object.keys(safeGrid(rows, row + p[0], col + p[1])).length !== 0);

	return surroundingCells - 1;
}

function getSurroundingVisibleCount(rows, row, col) {
	let visibleOrFlaggedCellCount = 0;
	let currentCell = {};
	permutations.forEach(p => {
			currentCell = safeGrid(rows, row + p[0], col + p[1]);

			if (Object.keys(currentCell).length !== 0)
				if (currentCell.visible) visibleOrFlaggedCellCount++;
		}
	);

	return visibleOrFlaggedCellCount - 1;
}

function getSurroundingFlagCount(rows, row, col) {
	let flaggedCellCount = 0;
	let currentCell = {};
	permutations.forEach(p => {
			currentCell = safeGrid(rows, row + p[0], col + p[1]);

			if (Object.keys(currentCell).length !== 0)
				if (currentCell.flagged) flaggedCellCount++;
		}
	);

	return flaggedCellCount;
}

function getVisibleSurroundingCells(rows, row, col) {
	return permutations.map(p => safeGrid(rows, row + p[0], col + p[1])).filter(c => c.visible && c.cellContent > 0);
}

function safeGrid(rows, row, col) {
	return (row < 0 || row > rows.length - 1 || col < 0 || col > rows[0].length - 1) ? {} : rows[row][col];
}