import {Component} from 'react';
import React from "react";
import {Board} from "./Board";

const cols = 10, rows = 10;

const indexes = [-1, 0, 1];

const permutations = indexes.map(i => indexes.map(i1 => [i, i1]));

export class MineSweeper extends Component {
	render() {
		return (<Board board={this.generateMines()}/>)
	}

	generateMines() {
		let mines = this.generate2DArray(rows, cols, () => Math.random() < 0.1);
		let cells = this.generate2DArray(rows, cols, () => [0, false]);

		for (let r = 0; r <= rows - 1; r++) {
			for (let c = 0; c <= cols - 1; c++) {
				let mineIndicator = -1;

				if (!mines[r][c]) {
					mineIndicator = 0;
					permutations.forEach(p => mineIndicator += safeMines(r + p[0][0], c + p[0][1]));
				}

				cells[r][c] = mineIndicator;
			}
		}

		return cells;

		function safeMines(row, column) {
			return (row < 0 || row >= rows || column < 0 || column >= cols) ? false : mines[row][column];
		}
	}

	generate2DArray(rowCount, columnCount, fillFun) {
		return Array.from({length: rowCount}, () =>
			Array.from({length: columnCount}, () => fillFun.apply())
		);
	}
}