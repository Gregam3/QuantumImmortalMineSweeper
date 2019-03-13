import React, { Component } from 'react';
import logo from './mylogo.png';
import './App.css';

let loadingMessages = ["Finding Reality"];

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
};


class App extends Component {
  state = {
    currentLoadingMessage: "Finding Reality"
  };

  componentDidMount() {
    this.loadingText();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="Loading-screen" alt="logo" />
          <p style={{paddingTop: '40px'}}>
            {this.state.currentLoadingMessage}
          </p>
        </header>
      </div>
    );
  }
  
  loadingText = async () => {
    for (let i = 0; i < 4; i++) {
      console.log(this.state.currentLoadingMessage);
      await sleep(500);
      this.setState({currentLoadingMessage : this.state.currentLoadingMessage + '.'});
    }
  };
}


export default App;
