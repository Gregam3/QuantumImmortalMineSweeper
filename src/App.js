import React, {Component} from 'react';
import {LoadSpinner} from './LoadSpinner.js';
import {Menu} from './Menu.js'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

import './App.css';
import {Instructions} from "./Instructions";
import {MineSweeper} from "./game/MineSweeper";



class App extends Component {


	render() {
		return (
			<div className="App">
				<header className="App-header">
					<Router>
						<div>
							<Link to="/loading">Load</Link>
							<br/>
							<Link to="/Instructions">Instructions</Link>
							<br/>
							<Link to="/play">Start Game</Link>

							<br/>
							<br/>

							<Route exact path="/" component={Menu}/>
							<Route exact path="/play" component={MineSweeper}/>
							<Route path="/loading" component={LoadSpinner}/>
							<Route path="/Instructions" component={Instructions}/>
						</div>
					</Router>
				</header>
			</div>
		);
	}
}

export default App;