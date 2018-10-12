import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';

import "../style/index.css";

import web3 from '../ethereum/web3';
import CrowdFundingContract from '../ethereum/crowdfunding';

import Check from './Check';

class App extends Component 
{
  constructor(props) {
    super(props);
    
    this.state = {
      login: true
    }
  }
  

  async componentDidMount()
  {
    const accounts = await web3.eth.getAccounts();

    if(typeof accounts[0] !== "undefined")
    {
      const registerFlag = await CrowdFundingContract.methods
                        .registered(accounts[0])
                        .call();

      if(registerFlag)
      {
      this.props.history.push("/dashboard");
      }
    }
    else
    {
      this.setState({
        login: false
      });
    }
  }

  renderLoginModal = () =>
  {
    return (
      <Modal isOpen={!this.state.login} backdrop={"static"}>
      <ModalHeader>Please Login into Metamask</ModalHeader>
      <ModalBody>
          Please Login into the Metamask extension to use our app.
          <br />
          <br />
          Refresh the page after LoggingIn.
      </ModalBody>
      </Modal>
    );
  }

  render() 
  {
    return (
      <div>
        <Check />

        {this.renderLoginModal()}

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
