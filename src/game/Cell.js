import {Component} from 'react';
import React from "react";
import '../App.css';

const CellType = {
	unTouched: 0,
	flagged: -1,
};

export class Cell extends Component {
	constructor(props) {
		super(props);

		this.state = {content: props.content}
	}

	render() {
		return (this.getCell())
	}

	getCell() {
		switch (this.state.content) {
			case 0:
				return <div className="cell"/>;
			case -1:
				return <div className="cell"> F </div>;
			default:
				return <div className="cell"
				            style={{color: '#'  + Math.floor(255 / 6 * this.state.content).toString(16) + '0000'}}> {this.state.content} </div>
		}
	}
}