import {Component} from 'react';
import React from "react";
import {Board} from "./Board";

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

export class MineSweeper extends Component {
	render() {
		//Todo change absolute width
		return <Board board={generateMines(3, 10, 10)}/>
	}
}