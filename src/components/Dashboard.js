import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { 
    Badge, Button, Card, CardTitle, CardText
} from 'reactstrap';

import { connect } from "react-redux";

import { 
    getUserProfile, getUserCampaigns 
} from '../actions/user';

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

        }
        else
        {
            this.props.history.push("/");
        }

        this.props.getUserProfile();

    }

    componentDidUpdate()
    {
        if(this.props.user && this.props.userCampaigns === null)
        {
            this.props.user.campaigns.forEach( address => {
                this.props.getUserCampaigns(address);
            });
        }
    }

    renderCampaigns = () =>
    {
        if(this.props.userCampaigns !== null)
        {
            return this.props.userCampaigns.map( campaign => {
                return (
                    <Card body key={campaign.name} className="campaign-card" >
                        <CardTitle>{campaign.name}</CardTitle>
                        <CardText>{campaign.description}</CardText>
                    </Card>
                );
            });
        }
        else
        {
            return null;
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
                <div className="campaign-card-container" >
                    {this.renderCampaigns()}
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
        user: state.user,
        userCampaigns: state.userCampaigns
    }
}

export default withRouter(connect(mapStateToProps,{
    getUserProfile,
    getUserCampaigns
})(Dashboard));
