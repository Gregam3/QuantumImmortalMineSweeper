import {Component} from 'react';
import React from "react";
import {Board} from "./Board";

const COLS = 10, ROWS = 10;

const indexes = [-1, 0, 1];

const permutations = indexes.flatMap(i => indexes.map(i1 => [i, i1]));

const BOMB_PERCENTAGE = 5;

export class MineSweeper extends Component {
	render() {
		//Todo change absolute width
		return (<div style={{width: '430px'}}>
			<Board board={this.generateMines()}/>
		</div>)
	}

	generateMines() {
		let mines = this.generate2DArray(ROWS, COLS, () => Math.random() < BOMB_PERCENTAGE / 100);
		let cells = this.generate2DArray(ROWS, COLS, () => [0, false]);

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

	generate2DArray(rowCount, columnCount, fillFun) {
		return Array.from({length: rowCount}, () =>
			Array.from({length: columnCount}, () => fillFun.apply())
		);
	}
}