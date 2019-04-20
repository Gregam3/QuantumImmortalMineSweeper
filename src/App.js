import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrophy, faFrown, faChevronCircleRight, faRedo, faPlayCircle, faQuestionCircle, faAtom, faCheck, faTimes, faSearch, faVolumeUp, faVolumeMute, faBomb} from '@fortawesome/free-solid-svg-icons';


import './App.css';
import {Instructions} from "./Instructions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MineSweeper} from "./game/MineSweeper";
import Sound from "react-sound";
import logo from "./logo.svg";
import {sleep} from "./LoadSpinner";

//FA icons
library.add(faTrophy, faFrown, faChevronCircleRight, faRedo, faPlayCircle, faQuestionCircle, faAtom, faCheck, faTimes, faSearch, faVolumeUp, faVolumeMute, faBomb);

document.addEventListener("contextmenu", function(e){
	e.preventDefault();
}, false);

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {play: false, titleFont: 200};
		this.performIntro()
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
				/>

				<header className="App-header">
					     <div style={{fontFamily: 'BaraliktoRegular', fontSize: this.state.titleFont + 'px', marginBottom: '20px', color: '#59d6ff'}}>QUANTUM <br/> MINESWEEPER</div>
					<Router>
						{this.state.titleFont > 40 ? "" : <div>
							<Link to="/play" ><button><FontAwesomeIcon icon="play-circle"/> Play</button></Link>
							<Link to="/instructions" ><button><FontAwesomeIcon icon="question-circle"/> Instructions </button></Link>
							<br/>
							<br/>
							<div style={{cursor:'pointer'}} onClick={() => this.setState({play: !this.state.play})}> Music &nbsp; <FontAwesomeIcon icon={this.state.play ?  "volume-up" : "volume-mute"}/> </div>
							<Route exact path="/play" component={MineSweeper}/>
							<Route path="/instructions" component={Instructions}/>
						</div>}
					</Router>

				</header>
			</div>
		);
	}

	performIntro = async () => {
		while(this.state.titleFont > 41) {
			await sleep(10);
			this.setState({titleFont: this.state.titleFont - 1})
		}

		await sleep(1000)
		this.setState({titleFont: this.state.titleFont - 1, play: true})
	}
}

export default App;