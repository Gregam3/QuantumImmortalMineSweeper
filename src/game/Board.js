import {Component} from 'react';
import {Cell} from "./Cell";
import React from "react";

export class Board extends Component {

	constructor(props) {
		super(props);

		this.state = {cells: props.board};
		console.log(this.state)
	}

	render() {
		let fuck = [];

		console.log(this.state)

		if(this.state.cells.length > 0) {
			for (let r = 0; r < 10; r++) {
				for (let c = 0; c < 10; c++) fuck.push(<Cell content={this.state.cells[r][c]}/>);
				fuck.push(<br/>);
			}
		}

		return fuck
	}
}