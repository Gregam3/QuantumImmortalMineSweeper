import {Component} from 'react';
import React from "react";
import '../App.css';

const CellType = {
	unTouched: 0,
	flagged: -1,
};

export class Cell extends Component {
	state = {
		display: Math.floor(Math.random() * 8) - 1
	};

	render() {
		return (this.getCell())
	}

	getCell() {
		console.log(Math.floor(255 / 6 * this.state.display).toString(16) + '0000');

		switch (this.state.display) {
			case 0:
				return <div className="cell"/>;
			case -1:
				return <div className="cell"> F </div>;
			default:
				return <div className="cell"
				            style={{color: '#'  + Math.floor(255 / 6 * this.state.display).toString(16) + '0000'}}> {this.state.display} </div>
		}
	}
}