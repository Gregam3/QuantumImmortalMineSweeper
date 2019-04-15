import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrophy, faFrown, faChevronCircleRight, faRedo, faPlayCircle, faQuestionCircle, faAtom, faCheck, faTimes, faSearch, faVolumeUp, faVolumeMute, faBomb} from '@fortawesome/free-solid-svg-icons';


import './App.css';
import {Instructions} from "./Instructions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MineSweeper} from "./game/MineSweeper";
import Sound from "react-sound";

//FA icons
library.add(faTrophy, faFrown, faChevronCircleRight, faRedo, faPlayCircle, faQuestionCircle, faAtom, faCheck, faTimes, faSearch, faVolumeUp, faVolumeMute, faBomb);

document.addEventListener("contextmenu", function(e){
	e.preventDefault();
}, false);

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {play: false};
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
					<Router>
						<div>
							<Link to="/play" ><button><FontAwesomeIcon icon="play-circle"/> Play</button></Link>
							<Link to="/instructions" ><button><FontAwesomeIcon icon="question-circle"/> Instructions </button></Link>
							<br/>
							<br/>
							<div style={{cursor:'pointer'}} onClick={() => this.setState({play: !this.state.play})}> Music &nbsp; <FontAwesomeIcon icon={this.state.play ?  "volume-up" : "volume-mute"}/> </div>
							<Route exact path="/play" component={MineSweeper}/>
							<Route path="/instructions" component={Instructions}/>
						</div>
					</Router>

				</header>
			</div>
		);
	}
}

export default App;