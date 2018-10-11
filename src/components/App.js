import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Button } from "reactstrap";

import "../style/index.css";

import Check from './Check';

import web3 from '../ethereum/web3';
import CrowdFundingContract from '../ethereum/crowdfunding';

class App extends Component 
{
  async componentDidMount()
  {
    const accounts = await web3.eth.getAccounts();

    const registerFlag = await CrowdFundingContract.methods
                          .registered(accounts[0])
                          .call();

    if(registerFlag)
    {
      this.props.history.push("/dashboard");
    }

  }

  render() 
  {
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

export default withRouter(App);
