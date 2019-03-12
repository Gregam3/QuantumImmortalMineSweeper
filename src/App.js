import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let loadingMessages = ["Generating ", 
  "Imitating Discord",
  "God these are annoying"];

class App extends Component {
  state = {
    currentLoadingMessage: ""
  };

  componentDidMount() {
    this.loadingText();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="Loading-screen" alt="logo" />
          <p>
            {this.state.currentLoadingMessage}
          </p>
        </header>
      </div>
    );
  }
  
  loadingText = async () => {
    this.setState({currentLoadingMessage : loadingMessages.shift()});
    for (let i = 0; i < 2; i++) {
      this.setState({currentLoadingMessage : this.state.currentLoadingMessage + '.'});
      setTimeout(null,  1000)
    }

    if(loadingMessages) setTimeout(this.loadingText,  1000)
  }
}


export default App;
