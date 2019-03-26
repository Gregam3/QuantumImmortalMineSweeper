import {Component} from 'react';
import {Cell} from "./Cell";
import React from "react";
import Sound from 'react-sound';
import '../App.css';
import {generateMines} from "./MineSweeper";

const indexes = [-1, 0, 1];
const permutations = indexes.flatMap(i => indexes.map(i1 => [i, i1]));

const Action = {
	Flag: "flag",
	Reveal: "pop",
	Bomb: "explosion",
	Finished: "complete",
	NoMoreFlags: "no-more-flags",
	Loss: ""
};

const GameState = {
	Playing: 0,
	Failed: 1,
	Success: 2
};

const COLS = 10, ROWS = 10;

export class Board extends Component {
	constructor(props) {
		super(props);

		this.state = {rows: props.board, lastEvent: null};

		this.makeCellVisible = this.makeCellVisible.bind(this);
		this.flag = this.flag.bind(this)
	}

	render() {
		const mines = this.getMines();
		const flags = this.getFlags();

		let gameState = GameState.Playing;

		if (JSON.stringify(mines) === JSON.stringify(flags)) {
			this.makeAllVisible();
			gameState = GameState.Success;
		}

		if(gameState === GameState.Playing) return this.game(mines, flags);
		if(gameState === GameState.Success) return this.victoryScreen();
		if(this.state.lastEvent === Action.Bomb) return  <Sound
			url={'explosion.mp3'}
			autoLoad={true}
			autoPlay={true}
			playStatus={Sound.status.PLAYING}
			playFromPosition={0}
			onFinishedPlaying={() => this.setState({lastEvent: Action.Loss})}
		/> + this.game(mines, flags)
		else return this.defeatScreen();
	}

	game(mines, flags) {
		return (
			(<div>{this.getAppropriateSoundEffect()}
				Mines: {mines.length}
				<br/>
				Flags: {flags.length}
				<br/>
				{this.state.rows.map(row =>
					row.map(cell => <Cell key={(cell.row, cell.col)}
					                      cellState={cell}
					                      onClick={() => this.makeCellVisible(cell.row, cell.col)}
					                      onContextMenu={() => this.flag(cell.row, cell.col)}/>))}
			</div>))
	}

	victoryScreen() {
		return (<div className="complete-screen"> Level Complete!
			<Sound
				url={'complete.mp3'}
				autoLoad={true}
				autoPlay={true}
				playStatus={Sound.status.PLAYING}
				playFromPosition={0}
			/>
			<br/>
			<button onClick={() => this.generateNewBoard()}> Generate new Board </button>
			<br/>
		</div>)
	}

	defeatScreen() {
		console.log('TEST \n\n\n\n\n')

		return (<div className="fail-screen"> Level Failed :(
			<button onClick={() => this.generateNewBoard()}> Generate new Board </button>
			<br/>
		</div>)
	}

	generateNewBoard() {
		console.log(this);
		this.setState({rows: generateMines(), lastEvent: null});
	}

	getAppropriateSoundEffect() {
		return (this.state.lastEvent && this.state.lastEvent !== Action.Bomb) ?
			(<Sound
				url={this.state.lastEvent + '.mp3'}
				autoLoad={true}
				autoPlay={true}
				playStatus={Sound.status.PLAYING}
				playFromPosition={0}
			/>) : "";
	}

	makeAllVisible() {
		this.state.rows.forEach(r => r.forEach(c => c.visible = true));
		if(this.state.lastEvent !== Action.Finished) this.setState({lastEvent: Action.Finished});
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

		this.setState({lastEvent: (cell.cellContent === -1) ? Action.Bomb: Action.Reveal});
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
			this.setState({lastEvent:Action.NoMoreFlags})
		} else {
			this.setState({lastEvent: Action.Flag});
			let cells = this.state.rows;
			let cell = cells[row][col];
			cell.flagged = !cell.flagged;
			cells[row][col] = cell;

			this.setState(cells);
		}
	};
}