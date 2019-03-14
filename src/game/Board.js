import {Component} from 'react';
import {Cell} from "./Cell";
import React from "react";

export class Board extends Component {
	render() {
		let cells = [];

		for (let r = 0; r < 10; r++) {
			for (let c = 0; c < 10; c++) cells.push(<Cell/>);
			cells.push(<br/>);
		}



		return cells
	}
}