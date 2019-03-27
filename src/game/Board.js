import {Component} from 'react';
import {Cell} from "./Cell";
import React from "react";
import Sound from 'react-sound';
import '../App.css';
import {generateMines} from "./MineSweeper";
import {LoadSpinner} from "../LoadSpinner";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
	Success: 2,
	Loading: 3
};

let gameState = GameState.Loading;
let level = 0;

const levels = [[2, 10, 10], [5, 12, 12], [10, 14, 14], [20, 16, 16], [30, 20, 20]];

const CELL_WIDTH = 40;

export class Board extends Component {
	constructor(props) {
		super(props);

		this.state = {rows: props.board, lastEvent: null};
	}

	render() {
		const mines = this.getMines();
		const flags = this.getFlags();

		const clickedBomb = this.state.lastEvent === Action.Bomb;

		if (JSON.stringify(mines) === JSON.stringify(flags) || clickedBomb) {
			this.makeAllVisible();
			gameState = (clickedBomb) ? GameState.Failed : GameState.Success;
		}

		if (gameState === GameState.Playing) return this.game(mines, flags);
		if(gameState === GameState.Loading) return <LoadSpinner onFinish={() => this.startPlaying()}/>;
		if (gameState === GameState.Success) return this.victoryScreen();
		return this.defeatScreen();
	}

	startPlaying() {
		gameState = GameState.Playing;
		this.setState({lastEvent: null})
	}

	game(mines, flags) {
		return (
			(<div style={{width: this.colCount() * CELL_WIDTH + 'px', fontFamily: 'BebasNeueRegular'}}>{this.getAppropriateSoundEffect()}
				Level: {level + 1}
			<br/>
				💣 {mines.length}
				🚩 {flags.length}
				<br/>
				{this.state.rows.map(row =>
					row.map(cell => <Cell key={(cell.row, cell.col)}
					                      cellState={cell}
					                      onClick={() => this.makeCellVisible(cell.row, cell.col)}
					                      onContextMenu={() => this.flag(cell.row, cell.col)}/>))}
			</div>))
	}

	victoryScreen() {
		level++;

		return (<div className="complete-screen" style={{width: '350px', height: '250px'}}>
			<br/>
			<FontAwesomeIcon icon="trophy"/> Level Complete! <FontAwesomeIcon icon="trophy"/>
			<Sound
				url={'complete.mp3'}
				autoLoad={true}
				autoPlay={true}
				playStatus={Sound.status.PLAYING}
				playFromPosition={0}
			/>
			<br/>

			<h1> <FontAwesomeIcon icon="chevron-circle-right" className="clickable" onClick={() => this.generateNewBoard()}/> </h1>
			<br/>
		</div>)
	}

	defeatScreen() {
		console.debug(this.state.lastEvent);

		return (
			<div className="fail-screen" style={{width: '350px', height: '250px'}}>
				<Sound
					url={'explosion.mp3'}
					autoLoad={true}
					autoPlay={true}
					playStatus={Sound.status.PLAYING}
					playFromPosition={0}
				/>
				<FontAwesomeIcon icon="frown"/> Level Failed <FontAwesomeIcon icon="frown"/>
				<br/>
				<h1> <FontAwesomeIcon icon="redo" className="clickable" onClick={() => this.generateNewBoard()}/> </h1>

			</div>)
	}

	generateNewBoard() {
		gameState = GameState.Loading;
		const levelParams = levels[level];
		this.setState({rows: generateMines(levelParams[0], levelParams[1], levelParams[2]), lastEvent: null});
	}

	getAppropriateSoundEffect() {
		return (this.state.lastEvent) ?
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

		this.setState({lastEvent: (cell.cellContent === -1) ? Action.Bomb : Action.Reveal});
		cell.visible = true;
		cells[row][col] = cell;

		this.setState({cells: this.makeConnectedCellsVisible()});
	};

	makeConnectedCellsVisible = () => {
		let cells = this.state.rows;
		let rows = this.rowCount();
		let cols = this.colCount();

		for (let i = 0; i < 10; i++) scanForCellsThatShouldBeVisible();

		return cells;

		function scanForCellsThatShouldBeVisible() {
			for (let r = 0; r <= rows - 1; r++) {
				for (let c = 0; c <= cols - 1; c++) {
					if (cells[r][c].visible && cells[r][c].cellContent === 0) permutations.forEach(p => makeApplicableCellVisible(r + p[0], c + p[1]));
				}
			}
		}

		function makeApplicableCellVisible(r, c) {
			if (r >= 0 && r < rows && c >= 0 && c < cols)
				if (!cells[r][c].visible) {
					cells[r][c].visible = true;
					cells[r][c].flagged = false;
				}
		}
	};

	rowCount() {
		return this.state.rows.length;
	}

	colCount() {
		return this.state.rows[0].length;
	}

	flag = (row, col) => {
		if (this.getFlags() >= this.getMines() && !this.state.rows[row][col].flagged) {
			this.setState({lastEvent: Action.NoMoreFlags})
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