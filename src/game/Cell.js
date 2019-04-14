import {Component} from 'react';
import React from "react";
import '../App.css';

export class Cell extends Component {
	constructor(props) {
		super(props);

		this.state = props.cellState;
	}

	render() {
		if (this.state.visible) return this.getCell();
		if (this.state.flagged) return <div className="cell threed-border" onContextMenu={this.props.onContextMenu}>🚩</div>;
		else return (<div className="cell threed-border" style={{cursor: 'pointer'}} onClick={this.props.onClick} onContextMenu={this.props.onContextMenu}/>)
	}

	getCell() {
		switch (this.state.cellContent) {
			case 0:
				return this.makeCell('', 0);
			case -1:
				return this.makeCell('💣', -1);
			default:
				return this.makeCell(this.state.cellContent, true);
		}
	}

	makeCell(content, typeNum) {
		if (typeNum === 0) return <div className="safe-cell threed-border" >{content}</div>;
		if (typeNum === -1) return <div className="danger-cell threed-border" >{content}</div>;
		return <div className="content-cell threed-border" style={{color: '#' + (100 + Math.floor((155 / 4)) * this.state.cellContent).toString(16) + '0000'}}> {content} </div>;
	}
}