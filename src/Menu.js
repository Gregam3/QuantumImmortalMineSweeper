import React, {Component} from 'react';

export class Menu extends Component {
	render() {
		this.props.setActivity(1);

		return (
			<div>
				<button onClick={this.props.setActivity(1)}>Start Game</button>
				<br/>
				<button onClick={this.props.setActivity(4)}>How to play</button>
				<br/>
				<button onClick={this.props.setActivity(5)}>What's different?</button>
			</div>
		)
	}
}