import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { 
    Badge, Button, Card, CardTitle, CardText
} from 'reactstrap';

import { connect } from "react-redux";

import { 
    getAllCampaignAddress, getAllCampaigns 
} from '../actions/campaign';

import web3 from '../ethereum/web3';
import CrowdFundingContract from '../ethereum/crowdfunding';

import Check from './Check';
import Topnav from './Topnav';

class Home extends Component 
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

        this.props.getAllCampaignAddress();
    }

    componentDidUpdate()
    {
        if(this.props.allCampaignAddress && this.props.allCampaigns === null)
        {
            this.props.allCampaignAddress.forEach( address => {
                this.props.getAllCampaigns(address);
            });
        }
    }

    renderCampaigns = () =>
    {
        if(this.props.allCampaigns !== null)
        {
            return this.props.allCampaigns.map( campaign => {
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

                <div className="sub-heading" >
                    All Campaigns&nbsp;
                    <Badge color="primary">
                        {
                            this.props.allCampaignAddress
                            ?this.props.allCampaignAddress.length
                            :null
                        }
                    </Badge>
                </div>
                <div className="campaign-card-container" >
                    {this.renderCampaigns()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) =>
{
    return {
        allCampaignAddress: state.allCampaignAddress,
        allCampaigns: state.allCampaigns
    }
}

export default withRouter(connect(mapStateToProps,{
    getAllCampaignAddress,
    getAllCampaigns
})(Home));
