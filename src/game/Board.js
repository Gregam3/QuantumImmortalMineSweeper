import {Component} from 'react';
import {Cell} from "./Cell";
import React from "react";

export class Board extends Component {

	constructor(props) {
		super(props);

		this.state = {rows: props.board};

		this.makeVisible = this.makeVisible.bind(this)
		this.flag = this.flag.bind(this)
	}

	render() {
		return this.state.rows.map(row =>
			row.map(cell =>
				<Cell key={(cell.row, cell.col)}
					cellState={cell}
				      onClick={() => this.makeVisible(cell.row, cell.col)}
				      onContextMenu={() => this.flag(cell.row, cell.col)}/>))
	}

	makeVisible = (row, col) => {
		console.log('test')

		let cells = this.state.rows;
		let cell = cells[row][col];
		cell.visible = true;
		cells[row][col] = cell;

		this.setState(cells);
	};

	flag = (row, col) => {
		console.log('test')

		let cells = this.state.rows;
		let cell = cells[row][col];
		cell.flagged = !cell.flagged;
		cells[row][col] = cell;

		this.setState(cells);
	}
}