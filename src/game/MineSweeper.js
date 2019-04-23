import {Component} from 'react';
import {Cell} from "./Cell";
import React from "react";
import Sound from 'react-sound';
import '../App.css';
import {generateMines, getFlags, getMines, isSolvable} from "./BoardLogic";
import {LoadSpinner} from "../LoadSpinner";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {sleep} from "../App";

const indexes = [-1, 0, 1];
const permutations = indexes.flatMap(i => indexes.map(i1 => [i, i1]));

const Action = {
	Flag: "flag", Reveal: "pop", Bomb: "explosion", Finished: "complete", NoMoreFlags: "incorrect", Loss: ""
};

const GameState = {
	Playing: 0, Failed: 1, Success: 2, Loading: 3
};

let gameState = GameState.Loading;
let level = 0;

// const levels = [ [0.001, 15, 20], [5, 10, 15], [10, 15, 15], [15, 15, 20], [30, 20, 20]];
const levels = [[2, 10, 10], [10, 10, 10], [15, 15, 15], [20, 15, 15], [25, 17, 17]];

const CELL_WIDTH = 40;

export class MineSweeper extends Component {
	buttonStates = {
		revealingCell: <div style={{color: '#47b8ff'}}>
			<Sound url={'searching.mp3'}  autoLoad={true} autoPlay={true} playStatus={Sound.status.PLAYING} playFromPosition={0}/>
			<FontAwesomeIcon icon="search" style={{animation: 'wobble infinite 0.2s linear alternate'}}/>
			&nbsp; Revealing Cell &nbsp; <FontAwesomeIcon icon="search"
			                                              style={{animation: 'wobble infinite 0.2s linear alternate'}}/>
		</div>,
		passive: <div className="clickable" style={{color: '#47b8ff'}} onClick={() => this.checkSolvability()}>
			<FontAwesomeIcon icon="atom"/>&nbsp; Is Solvable?&nbsp; <FontAwesomeIcon icon="atom"/>
		</div>,
		calculating: <div style={{color: '#47b8ff'}}>
			<Sound url={'calculating.mp3'}  autoLoad={true} autoPlay={true} playStatus={Sound.status.PLAYING} playFromPosition={0}/>
			<FontAwesomeIcon icon="atom" style={{animation: 'spin infinite 2s linear'}}/>
			&nbsp; Calculating &nbsp; <FontAwesomeIcon icon="atom" style={{animation: 'spin infinite 2s linear'}}/>
		</div>,
		possible: <div style={{color: '#058d00'}}>
			<Sound url={'correct.mp3'}  autoLoad={true} autoPlay={true} playStatus={Sound.status.PLAYING} playFromPosition={0}/>
			<FontAwesomeIcon icon="check"/>&nbsp; Solvable &nbsp; <FontAwesomeIcon icon="check"/>
		</div>,
		impossible: <div style={{color: '#a10002'}}>
			<Sound url={'incorrect.mp3'}  autoLoad={true} autoPlay={true} playStatus={Sound.status.PLAYING} playFromPosition={0}/>
			<FontAwesomeIcon icon="times"/>&nbsp; Not Solvable &nbsp; <FontAwesomeIcon icon="times"/>
		</div>
	};

	lastEvent = null;

	constructor(props) {
		super(props);

		this.state = {
			rows: generateMines(levels[0][0], levels[0][1], levels[0][2]),
			solvabilityButton: this.buttonStates.calculating
		};
	}

	render() {
		console.debug('rendered');
		const mines = getMines(this.state.rows);
		const flags = getFlags(this.state.rows);

		const clickedBomb = this.lastEvent === Action.Bomb;

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
		this.setState({solvabilityButton: this.buttonStates.calculating});
		this.lastEvent = null;
		await sleep(1000);

		const solvable = isSolvable(this.state.rows);
		if (!solvable) {
			await sleep(1000);

			let waitTime = 500;

			while (!isSolvable(this.state.rows)) {
				this.setState({solvabilityButton: this.buttonStates.impossible});
				await sleep(waitTime);
				this.setState({solvabilityButton: this.buttonStates.revealingCell});
				await sleep(waitTime);
				this.revealCell();

				waitTime = waitTime * 0.8;
			}
		}

		this.setState({solvabilityButton: this.buttonStates.possible});
		await sleep(2000);
		this.setState({solvabilityButton: this.buttonStates.passive});
	};

	revealCell() {
		const cell = this.state.rows[Math.floor(Math.random() * this.state.rows.length)][Math.floor(Math.random() * this.state.rows.length)];

		if (cell.cellContent > -1 && !cell.visible) this.makeCellVisible(cell.row, cell.col);
		else this.revealCell();
	}

	startPlaying = async () => {
		gameState = GameState.Playing;
		this.lastEvent = null;
		await this.checkSolvability();
		await sleep(1500);
		this.setState({solvabilityButton: this.buttonStates.passive});
	};

	game(mines, flags) {
		return (
			(<div style={{
				width: this.colCount() * CELL_WIDTH + 'px',
				fontFamily: 'BebasNeueRegular'
			}}>{this.getAppropriateSoundEffect()}
				<div style={{fontSize: '35px'}}>
					💣 {mines.length}
					🚩 {flags.length}

					&nbsp; &nbsp; &nbsp; Level: {level + 1}
					<br/>
					<div style={{
						width: '300px',
						left: 0,
						right: 0,
						marginLeft: 'auto',
						marginRight: 'auto',
						position: 'absolute',
						backgroundColor: '#fff',
						borderRadius: '25px',
						userSelect: 'none',
						cursor: 'progress'
					}}>
						{this.state.solvabilityButton}</div>
					<br/>

				</div>
				<div style={{marginTop: '20px'}}>
					{this.state.rows.map(row =>
						row.map(cell => <Cell key={(cell.row, cell.col)}
						                      cellState={cell}
						                      onClick={() => this.makeCellVisible(cell.row, cell.col)}
						                      onContextMenu={() => this.flag(cell.row, cell.col)}/>))} </div>
			</div>))
	}

	victoryScreen() {
		if (level < 5 && !this.levelledUp) {
			level++;
			this.levelledUp = true;
			console.debug('test')
		}

		return (<div className="complete-screen" style={{width: '500px', height: '400px', fontSize: '50px'}}>
			<br/>
			<FontAwesomeIcon icon="trophy"/> Level {level} Complete! <FontAwesomeIcon icon="trophy"/>
			<Sound
				url={'complete.mp3'}  autoLoad={true} autoPlay={true} playStatus={Sound.status.PLAYING} playFromPosition={0}
			/>
			<br/>
			<h1><FontAwesomeIcon icon={level === 5 ? "redo" : "chevron-circle-right"} className="clickable"
			                     onClick={() => this.generateNewBoard()}/></h1>
			<br/>
		</div>)
	}

	defeatScreen() {
		return (
			<div className="fail-screen" style={{width: '500px', height: '400px', fontSize: '50px'}}>
				<Sound
					url={'explosion.mp3'}
					autoLoad={true}
					autoPlay={true}
					playStatus={Sound.status.PLAYING}
					playFromPosition={0}
				/>
				<br/>

				<FontAwesomeIcon icon="bomb"/> Level {level + 1} Failed <FontAwesomeIcon icon="bomb"/>
				<br/>
				<h1><FontAwesomeIcon icon="redo" className="clickable" onClick={() => this.generateNewBoard()}/></h1>

			</div>)
	}

	generateNewBoard() {
		this.levelledUp = false;
		this.startPlaying()
		const levelParams = levels[level];
		this.setState({rows: generateMines(levelParams[0], levelParams[1], levelParams[2])});
	}

	getAppropriateSoundEffect() {
		const sound = (this.lastEvent) ?
			(<Sound
				url={this.lastEvent + '.mp3'}
				autoLoad={true}
				autoPlay={true}
				playStatus={Sound.status.PLAYING}
				playFromPosition={0}
			/>) : "";
		this.lastEvent = null;

		return sound;
	}

	makeAllVisible() {
		this.state.rows.forEach(r => r.forEach(c => c.visible = true));
	}

	makeCellVisible = (row, col) => {
		let cells = this.state.rows;
		let cell = cells[row][col];

		this.lastEvent = (cell.cellContent === -1) ? Action.Bomb : Action.Reveal
		cell.visible = true;
		cells[row][col] = cell;
		this.setState({rows: cells});
		if (cell.cellContent !== -1) this.makeConnectedCellsVisible();

	};

	makeConnectedCellsVisible = async () => {
		let cells = this.state.rows;
		let rows = this.rowCount();
		let cols = this.colCount();

		while (scanForCellsThatShouldBeVisible()) {
			await sleep(200);
			console.debug('here');
			this.lastEvent = Action.Reveal;
			this.setState({rows: cells});
		}

		function scanForCellsThatShouldBeVisible() {
			let changed = false;

			for (let r = 0; r <= rows - 1; r++) {
				for (let c = 0; c <= cols - 1; c++) {
					if (cells[r][c].visible && cells[r][c].cellContent === 0) {
						permutations.forEach(p => {
							if (makeApplicableCellVisible(r + p[0], c + p[1])) changed = true;
						});

					}
				}
			}

			return changed;
		}

		function makeApplicableCellVisible(r, c) {
			if (r >= 0 && r < rows && c >= 0 && c < cols)
				if (!cells[r][c].visible) {
					cells[r][c].visible = true;
					cells[r][c].flagged = false;
					return true;
				}
			return false;
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
			this.lastEvent = Action.NoMoreFlags
		} else {
			this.lastEvent = Action.Flag
			let cells = this.state.rows;
			let cell = cells[row][col];
			cell.flagged = !cell.flagged;
			cells[row][col] = cell;

			this.setState({rows: cells});

			console.debug('Flagged: ' + row + ":" + col)
		}
	};
}
