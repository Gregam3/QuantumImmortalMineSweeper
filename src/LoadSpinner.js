import React, {Component} from 'react';
import logo from "./mylogo.png";


const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
};

export class LoadSpinner extends Component {
	state = {
		currentLoadingMessage: "Finding Reality",
		logoSize: 40
	};

	componentDidMount() {
		this.loadingText()
	}

	loadingText = async () => {
		for (let i = 0; i < 4; i++) {
			console.log(this.state.currentLoadingMessage);
			if (i < 3) this.setState({currentLoadingMessage: this.state.currentLoadingMessage + '.'});
			else {
				this.setState({currentLoadingMessage: "Found!"});
				this.finishLoadingAnimation();
			}
			await sleep(500);
		}
	};

	finishLoadingAnimation = async () => {
		for (let i = 0; i < 70; i++) {
			this.setState({logoSize: this.state.logoSize + 0.5});
			await sleep(0.1);
		}

		for (let i = 100; i > 0; i--) {
			this.setState({logoSize: this.state.logoSize - 1});
			await sleep(2);
		}
	};

	render() {
		return (
			<div>
				<img id="loading-spinner" style={{height: this.state.logoSize + 'vmin'}} src={logo}
				     className="Loading-screen" alt="logo"/>
				<p style={{paddingTop: '40px'}}>
					{(this.state.currentLoadingMessage !== "Found!") ? this.state.currentLoadingMessage : ""}
				</p>
			</div>
		)
	}
}