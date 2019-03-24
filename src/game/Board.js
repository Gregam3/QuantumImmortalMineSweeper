import {Component} from 'react';
import {Cell} from "./Cell";
import React from "react";
import Sound from 'react-sound';

const indexes = [-1, 0, 1];
const permutations = indexes.flatMap(i => indexes.map(i1 => [i, i1]));

const Action = {
	Flag: "flag",
	Reveal: "pop",
	Bomb: "explosion",
	Finished: "complete",
	NoMoreFlags: "no-more-flags"
};


const COLS = 10, ROWS = 10;

export class Board extends Component {

	constructor(props) {
		super(props);

		this.state = {rows: props.board, lastAction: null};

		this.makeCellVisible = this.makeCellVisible.bind(this);
		this.flag = this.flag.bind(this)
	}

	render() {
		const mines = this.getMines();
		const flags = this.getFlags();

		if (JSON.stringify(mines) === JSON.stringify(flags)) this.makeAllVisible();

		return (<div>
			{this.getAppropriateSoundEffect()}

			Mines: {mines.length}
			<br/>
			Flags: {flags.length}
			<br/>
			{this.state.rows.map(row =>
				row.map(cell => <Cell key={(cell.row, cell.col)}
				                      cellState={cell}
				                      onClick={() => this.makeCellVisible(cell.row, cell.col)}
				                      onContextMenu={() => this.flag(cell.row, cell.col)}/>))}</div>)
	}

	getAppropriateSoundEffect() {
		return (this.state.lastAction) ?
			(<Sound
				url={this.state.lastAction + '.mp3'}
				autoLoad={true}
				autoPlay={true}
				playStatus={Sound.status.PLAYING}
				playFromPosition={0}
			/>) : "";

	}


	makeAllVisible() {
		this.state.rows.forEach(r => r.forEach(c => c.visible = true));
		if(this.state.lastAction !== Action.Finished) this.setState({lastAction: Action.Finished});
	}

	getMines() {
		let minePositions = [];

		this.state.rows.forEach(r => r.forEach(c => {
			if (c.cellContent === -1) minePositions.push(c);
		}));

		return minePositions;
	};

	getFlags() {
		let flagPositions = [];

		this.state.rows.forEach(r => r.forEach(c => {
			if (c.flagged) flagPositions.push(c);
		}));

		return flagPositions;
	};

	makeCellVisible = (row, col) => {
		let cells = this.state.rows;
		let cell = cells[row][col];

		this.setState({lastAction: (cell.cellContent === -1) ? Action.Bomb: Action.Reveal});
		cell.visible = true;
		cells[row][col] = cell;

		this.setState({cells: this.makeConnectedCellsVisible()});
	};

	makeConnectedCellsVisible = () => {
		let cells = this.state.rows;

		for (let i = 0; i < 5; i++) scanForCellsThatShouldBeVisible();


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
				if (!cells[r][c].visible)  {
					cells[r][c].visible = true;
					cells[r][c].flagged = false;
				}
		}
	};

	flag = (row, col) => {
		if(this.getFlags() >= this.getMines() && !this.state.rows[row][col].flagged) {
			this.setState({lastAction:Action.NoMoreFlags})
		} else {
			this.setState({lastAction: Action.Flag});
			let cells = this.state.rows;
			let cell = cells[row][col];
			cell.flagged = !cell.flagged;
			cells[row][col] = cell;

			this.setState(cells);
		}
	};
}