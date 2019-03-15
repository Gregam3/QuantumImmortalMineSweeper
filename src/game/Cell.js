import {Component} from 'react';
import React from "react";
import '../App.css';

export class Cell extends Component {
	constructor(props) {
		super(props);

		this.state = {
			content: props.content,
			visible: false,
			flagged: false
		}

	}

	render() {
		if (this.state.visible) return this.getCell()
		if (this.state.flagged) return <div className="cell" onContextMenu={this.flag}>🏳️</div>
		else return (<div className="cell" onClick={this.makeVisible} onContextMenu={this.flag}/>)
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

	makeVisible = () => {
		console.log(this.state.content);
		this.setState({visible: true})
	};

	flag = () => {
		this.setState({flagged: !this.state.flagged});
	}
}