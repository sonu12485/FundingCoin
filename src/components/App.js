import React, { Component } from 'react';

import "../style/index.css";

import Check from './Check';

class App extends Component {
  render() {
    return (
      <div>
        <Check />
        
        <div className="header" >
          <h1>Crowd Funding Platform</h1>
        </div>
        
      </div>
    );
  }
}

export default App;
