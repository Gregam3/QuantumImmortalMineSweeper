import React, {Component} from 'react';
import {LoadSpinner} from './LoadSpinner.js';
import {Menu} from './Menu.js'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

import './App.css';
import {Instructions} from "./Instructions";
import {MineSweeper} from "./game/MineSweeper";

document.addEventListener("contextmenu", function(e){
	e.preventDefault();
}, false);

class App extends Component {

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<Router>
						<div>
							<Link to="/loading"><button>Load</button></Link>
							<Link to="/instructions"><button>Instructions</button></Link>
							<Link to="/play"><button>Start Game</button></Link>

							<br/>
							<br/>

							<Route exact path="/" component={Menu}/>
							<Route exact path="/play" component={MineSweeper}/>
							<Route path="/loading" component={LoadSpinner}/>
							<Route path="/instructions" component={Instructions}/>
						</div>
					</Router>
				</header>
			</div>
		);
	}
}

export default App;