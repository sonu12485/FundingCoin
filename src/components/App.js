import React, { Component } from 'react';

import { Button } from "reactstrap";

import "../style/index.css";

import Check from './Check';

class App extends Component {
  render() {
    return (
      <div>
        <Check />

        <div className="header" >
          <div className="heading" >FundingCoin</div>
          <div>A Blockchain Based Crowd Funding Platform</div>
        </div>
        <br />
        <br />
        <div className="register-container" >
          <h2>Register To Get Started</h2>
          <Button 
            color="primary" 
            href="/register"
          >Register</Button>
        </div>
        
      </div>
    );
  }
}

export default App;
