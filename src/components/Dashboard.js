import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

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

    render() 
    {
        return (
            <div>
                <Check />

                <Topnav />

                <div className="welcome" >
                    Welcome {this.props.user?this.props.user.name:null} ,
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
