import {Component} from 'react';
import {Cell} from "./Cell";
import React from "react";

const indexes = [-1, 0, 1];
const permutations = indexes.flatMap(i => indexes.map(i1 => [i, i1]));

const COLS = 10, ROWS = 10;

export class Board extends Component {

	constructor(props) {
		super(props);

		this.state = {rows: props.board};

		this.makeCellVisible = this.makeCellVisible.bind(this)
		this.flag = this.flag.bind(this)
	}

	render() {
		return this.state.rows.map(row =>
			row.map(cell =>
				<Cell key={(cell.row, cell.col)}
				      cellState={cell}
				      onClick={() => this.makeCellVisible(cell.row, cell.col)}
				      onContextMenu={() => this.flag(cell.row, cell.col)}/>))
	}

	makeCellVisible = (row, col) => {
		let cells = this.state.rows;
		let cell = cells[row][col];
		cell.visible = true;
		cells[row][col] = cell;

		this.setState({cells: this.makeConnectedCellsVisible()});
	};

	makeConnectedCellsVisible = () => {
		let cells = this.state.rows;

		for (let i = 0; i < 10; i++) scanForCellsThatShouldBeVisible();


		return cells;
		
		function scanForCellsThatShouldBeVisible() {
			for (let r = 0; r <= ROWS - 1; r++) {
				for (let c = 0; c <= COLS - 1; c++) {
					if (cells[r][c].visible && cells[r][c].cellContent === 0) permutations.forEach(p => makeApplicableCellVisible(r + p[0], c + p[1]));
				}
			}
		}

		function makeApplicableCellVisible(r, c) {
			if (r >= 0 && r < ROWS && c >= 0 && c < COLS)
				if(!cells[r][c].visible) cells[r][c].visible = true;
		}
	};

	flag = (row, col) => {
		let cells = this.state.rows;
		let cell = cells[row][col];
		cell.flagged = !cell.flagged;
		cells[row][col] = cell;

		this.setState(cells);
	};
}