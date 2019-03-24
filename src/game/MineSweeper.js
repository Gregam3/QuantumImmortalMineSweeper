import {Component} from 'react';
import React from "react";
import {Board} from "./Board";

let COLS = 10, ROWS = 10;

const indexes = [-1, 0, 1];

const permutations = indexes.flatMap(i => indexes.map(i1 => [i, i1]));

const BOMB_PERCENTAGE = 2;

export function generateMines() {
	let mines = generate2DArray(ROWS, COLS, () => Math.random() < BOMB_PERCENTAGE / 100);
	let cells = generate2DArray(ROWS, COLS, () => [0, false]);

	for (let r = 0; r <= ROWS - 1; r++) {
		for (let c = 0; c <= COLS - 1; c++) {
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
		return (row < 0 || row >= ROWS || column < 0 || column >= COLS) ? false : mines[row][column];
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
		return (<div style={{width: '430px'}}>
			<Board board={generateMines()}/>
		</div>)
	}
}