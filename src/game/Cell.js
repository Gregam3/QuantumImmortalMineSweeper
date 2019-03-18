import {Component} from 'react';
import React from "react";
import '../App.css';

export class Cell extends Component {
	constructor(props) {
		super(props);

		this.state = props.cellState;
	}

	render() {
		if (this.state.visible) return this.getCell()
		if (this.state.flagged) return <div className="cell">🏳️</div>
		else return (<div className="cell"/>)
	}

	getCell() {
		switch (this.state.content) {
			case 0:
				return <div className="cell">S </div>;
			case -1:
				return <div className="cell">💣 </div>;
			default:
				return <div className="cell"
				            style={{color: '#' + Math.floor((255 / 8) * this.state.content).toString(16) + '0000'}}
				> {this.state.content} </div>
		}
	}
}