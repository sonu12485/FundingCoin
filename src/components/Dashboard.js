import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Badge, Button } from 'reactstrap';

import { connect } from "react-redux";

import { getUserProfile } from '../actions/user';

import web3 from '../ethereum/web3';
import CrowdFundingContract from '../ethereum/crowdfunding';

import Check from './Check';
import Topnav from './Topnav';

class Dashboard extends Component 
{

    async componentDidMount()
    {
        const accounts = await web3.eth.getAccounts();

        if(typeof accounts[0] !== "undefined")
        {
           const registerFlag = await CrowdFundingContract.methods
                                .registered(accounts[0])
                                .call();

            if(!registerFlag)
            {
                this.props.history.push("/");
            } 

            if(this.props.user === null)
            {
                this.props.getUserProfile();
            }
        }
        else
        {
            this.props.history.push("/");
        }
    }

    render() 
    {
        return (
            <div>
                <Check />

                <Topnav />

                <div className="welcome" >
                    Welcome {this.props.user?this.props.user.name:null} ,
                </div>
                <div className="sub-heading" >
                    Your Campaigns&nbsp;
                    <Badge color="primary">
                        {this.props.user?this.props.user.campaigns.length:null}
                    </Badge>
                </div>
                <div>
                    <br />
                    <br />
                </div>
                <div style={{textAlign: "center"}} >
                    <Button 
                        color="primary"
                        onClick = { () => this.props.history.push("/create") }
                    >Start a Campaign</Button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) =>
{
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps,{
    getUserProfile
})(Dashboard));
