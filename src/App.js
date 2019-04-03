import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrophy, faFrown, faChevronCircleRight, faRedo, faPlayCircle, faQuestionCircle, faAtom } from '@fortawesome/free-solid-svg-icons';


import './App.css';
import {Instructions} from "./Instructions";
import {BoardLogic} from "./game/BoardLogic";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MineSweeper} from "./game/MineSweeper";

//FA icons
library.add(faTrophy, faFrown, faChevronCircleRight, faRedo, faPlayCircle, faQuestionCircle, faAtom);

document.addEventListener("contextmenu", function(e){
	e.preventDefault();
}, false);

class App extends Component {

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<Router>
						<div >
							<Link to="/play" ><button><FontAwesomeIcon icon="play-circle"/> Play</button></Link>
							<Link to="/instructions" ><button><FontAwesomeIcon icon="question-circle"/> Instructions </button></Link>

							<br/>
							<br/>

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