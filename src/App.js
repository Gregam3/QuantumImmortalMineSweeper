import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import {faTrophy, faFrown, faChevronCircleRight, faRedo, faPlayCircle,
	faQuestionCircle, faAtom, faCheck, faTimes, faSearch, faVolumeUp,
	faVolumeMute, faBomb, faRunning, faWalking} from '@fortawesome/free-solid-svg-icons';
import './App.css';
import {Instructions} from "./Instructions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MineSweeper} from "./game/MineSweeper";
import Sound from "react-sound";


//FA icons
library.add(faTrophy, faFrown, faChevronCircleRight, faRedo, faPlayCircle,
	faQuestionCircle, faAtom, faCheck, faTimes, faSearch, faVolumeUp, faVolumeMute,
	faBomb, faRunning, faWalking);

document.addEventListener("contextmenu", function(e){
	e.preventDefault();
}, false);

export const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, (fastMode) ? 0 : milliseconds));

let fastMode = false;

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {play: false, titleFont: 200, showRouting: false};
		this.performIntro();
		this.showOptionsAfterLoaded();
	}

	render() {
		return (
			<div className="App">
				<Sound
					url={'off-limits.wav'}
					autoLoad={true}
					autoPlay={true}
					playStatus={Sound.status.PLAYING}
					playFromPosition={0}
					loop={true}
					volume={this.state.play ? 40 : 0}
					// volume={0}
				/>

				<header className="App-header">
					     <div style={{fontFamily: 'BaraliktoRegular', fontSize: this.state.titleFont + 'px', marginBottom: '20px', color: '#59d6ff'}}>QUANTUM <br/> MINESWEEPER</div>
					<Router>
						{this.state.titleFont > 40 ? "" : <div>
							{this.state.showRouting ? <Link to="/" ><button><FontAwesomeIcon icon="play-circle"/> Play</button></Link> : ""}
							{this.state.showRouting ? <Link to="/instructions" onClick={() => this.setState({play: false})}><button><FontAwesomeIcon icon="question-circle"/> Instructions </button></Link> : ""}
							<br/>
							<div style={{cursor:'pointer'}} onClick={() => this.setState({play: !this.state.play})}> Music &nbsp; <FontAwesomeIcon icon={this.state.play ?  "volume-up" : "volume-mute"}/> </div>
							<div style={{cursor:'pointer'}} onClick={() => this.toggleFastMode()}>  &nbsp;  &nbsp; Fast Mode &nbsp; <FontAwesomeIcon icon={this.state.fastMode ?  "walking" : "running"}/> </div>
							<Route exact path="/" component={MineSweeper}/>
							<Route path="/instructions" component={Instructions}/>
						</div>}
					</Router>

				</header>
			</div>
		);
	}

	toggleFastMode() {
		fastMode = !fastMode;
		//Necessary to load correct icon
		this.setState({fastMode});
		console.debug(fastMode)
	}

	showOptionsAfterLoaded = async () => {
		await sleep(5500);
		this.setState({showRouting: true, play:true});
	};

	performIntro = async () => {
		while(this.state.titleFont > 41) {
			await sleep(10);
			this.setState({titleFont: this.state.titleFont - 1})
		}

		await sleep(1000);
		this.setState({titleFont: this.state.titleFont - 1})
	}
}

export default App;