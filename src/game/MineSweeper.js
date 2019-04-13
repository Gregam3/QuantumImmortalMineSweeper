import {Component} from 'react';
import {Cell} from "./Cell";
import React from "react";
import Sound from 'react-sound';
import '../App.css';
import {generateMines, getFlags, getMines, isSolvable} from "./BoardLogic";
import {LoadSpinner, sleep} from "../LoadSpinner";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

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
	Playing: 0,	Failed: 1, Success: 2, Loading: 3
};

let gameState = GameState.Loading;
let level = 0;

// const levels = [ [15, 15, 20], [5, 10, 15], [10, 15, 15], [15, 15, 20], [30, 20, 20]];
const levels = [[2, 10, 10], [5, 10, 10], [15, 15, 15], [15, 15, 20], [25, 17, 17]];

const CELL_WIDTH = 40;

export class MineSweeper extends Component {
	buttonStates = {
		revealingCell: <div style={{color: '#47b8ff'}}>
			<FontAwesomeIcon  icon="search" style={{animation: 'wobble infinite 0.2s linear alternate'}}/>
			&nbsp; Revealing Cell &nbsp; <FontAwesomeIcon  icon="search" style={{animation: 'wobble infinite 0.2s linear alternate'}}/>
		</div>,
		passive: <div className="clickable" style={{color: '#47b8ff'}} onClick={() => this.checkSolvability()}>
			<FontAwesomeIcon icon="atom" />&nbsp; Solve&nbsp; <FontAwesomeIcon icon="atom"/>
		</div>,
		calculating: <div style={{color: '#47b8ff'}}>
			<FontAwesomeIcon  icon="atom" style={{animation: 'spin infinite 2s linear'}}/>
			&nbsp; Calculating &nbsp; <FontAwesomeIcon  icon="atom" style={{animation: 'spin infinite 2s linear'}}/>
		</div>,
		possible: <div style={{color: '#058d00'}}>
			<FontAwesomeIcon icon="check"/>&nbsp; Solvable &nbsp; <FontAwesomeIcon  icon="check"/>
		</div>,
		impossible: <div style={{color: '#a10002'}}>
			<FontAwesomeIcon icon="times"/>&nbsp; Not Solvable &nbsp; <FontAwesomeIcon  icon="times"/>
		</div>
	};

	constructor(props) {
		super(props);

		this.state = {
			rows: generateMines(levels[0][0], levels[0][1], levels[0][2]),
			lastEvent: null,
			solvabilityButton: this.buttonStates.calculating
		};
	}

	render() {
		const mines = getMines(this.state.rows);
		const flags = getFlags(this.state.rows);

		const clickedBomb = this.state.lastEvent === Action.Bomb;

		if (JSON.stringify(mines) === JSON.stringify(flags) || clickedBomb) {
			this.makeAllVisible();
			gameState = (clickedBomb) ? GameState.Failed : GameState.Success;
		}

		if (gameState === GameState.Playing) return this.game(mines, flags);
		if (gameState === GameState.Loading) return <LoadSpinner onFinish={() => this.startPlaying()}/>;
		if (gameState === GameState.Success) return this.victoryScreen();
		return this.defeatScreen();
	}

	checkSolvability = async () => {
		this.setState({solvabilityButton: this.buttonStates.calculating, lastEvent: null});
		await sleep(1000);

		const solvable = isSolvable(this.state.rows);
		if(!solvable) {
			await sleep(1000);

			while (!isSolvable(this.state.rows)) {
				this.setState({solvabilityButton: this.buttonStates.impossible});
				await sleep(500);
				this.setState({solvabilityButton: this.buttonStates.revealingCell});
				await sleep(500);
				this.revealCell();
			}
		}

		this.setState({solvabilityButton: this.buttonStates.possible});
		await sleep(2000);
		this.setState({solvabilityButton: this.buttonStates.passive});
	};

	revealCell() {
		const cell = this.state.rows[Math.floor(Math.random() * this.state.rows.length)][Math.floor(Math.random() * this.state.rows.length)];

		if(cell.cellContent > -1) this.makeCellVisible(cell.row, cell.col);
		else this.revealCell();
	}

	startPlaying = async () =>  {
		gameState = GameState.Playing;
		this.setState({lastEvent: null, solvabilityButton: this.buttonStates.revealingCell});
		await sleep(1500);
		await this.checkSolvability();
		this.setState({solvabilityButton: this.buttonStates.passive});
	};

	game(mines, flags) {
		return (
			(<div style={{
				width: this.colCount() * CELL_WIDTH + 'px',
				fontFamily: 'BebasNeueRegular'
			}}>{this.getAppropriateSoundEffect()}
			<div style={{fontSize: '35px'}}>
				Level: {level + 1}
				<br/>
				💣 {mines.length}
				🚩 {flags.length}
				<br/>
				<div style={{width:'300px', left:0, right:0, marginLeft: 'auto', marginRight: 'auto', position: 'absolute',
					backgroundColor: '#fff', borderRadius: '25px', userSelect: 'none', cursor:'progress'}}>
					{this.state.solvabilityButton}</div>
				<br/><br/>
			</div>
				{this.state.rows.map(row =>
					row.map(cell => <Cell key={(cell.row, cell.col)}
					                      cellState={cell}
					                      onClick={() => this.makeCellVisible(cell.row, cell.col)}
					                      onContextMenu={() => this.flag(cell.row, cell.col)}/>))}
			</div>))
	}

	victoryScreen() {
		if(level < 4) level++;

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
			<h1><FontAwesomeIcon icon={level === 4 ? "redo" : "chevron-circle-right"} className="clickable"
			                     onClick={() => this.generateNewBoard()}/></h1>
			<br/>
		</div>)
	}

	defeatScreen() {
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
				<h1><FontAwesomeIcon icon="redo" className="clickable" onClick={() => this.generateNewBoard()}/></h1>

			</div>)
	}

	generateNewBoard() {
		gameState = GameState.Loading;
		const levelParams = levels[level];
		this.setState({rows: generateMines(levelParams[0], levelParams[1], levelParams[2])});
		this.startPlaying();
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

		for (let i = 0; i < rows; i++) scanForCellsThatShouldBeVisible();

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
		if (getFlags(this.state.rows) >= getMines(this.state.rows) && !this.state.rows[row][col].flagged) {
			this.setState({lastEvent: Action.NoMoreFlags})
		} else {
			this.setState({lastEvent: Action.Flag});
			let cells = this.state.rows;
			let cell = cells[row][col];
			cell.flagged = !cell.flagged;
			cells[row][col] = cell;

			this.setState(cells);

			console.debug('Flagged: ' + row +":" + col)
		}
	};
}