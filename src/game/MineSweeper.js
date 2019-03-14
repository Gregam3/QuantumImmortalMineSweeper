import {Component} from 'react';
import React from "react";
import {Board} from "./Board";

export class MineSweeper extends Component {
	state = {
		currentLoadingMessage: "Finding Reality",
		logoSize: 40
	};

	render() {
		return (<Board/>)
	}
}