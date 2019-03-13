import React, { Component } from 'react';
import {LoadSpinner} from './LoadSpinner.js';
import {Menu} from './Menu.js'

import './App.css';


const Activities = {
    LOADING: 1,
    MENU: 2,
    PLAYING: 3,
    HOW_TO_PLAY: 4,
    WHATS_DIFFERENT: 5
};

class App extends Component {
    state = {
      currentActivity: Activities.LOADING
    };

  render() {
    return (
      <div className="App">
        <header className="App-header" >
          {this.getActivity()}
        </header>
      </div>
    );
  }

    getActivity() {
        switch (this.state.currentActivity) {
            case Activities.LOADING: return (<LoadSpinner setActivity={this.setActivity}/>);
            case Activities.MENU: return (<Menu setActivity={this.setActivity}/>);
        }
    }

    setActivity(activityNumber) {
        console.log(this.state);
        this.setState({currentActivity: activityNumber})
    }
}

export default App;