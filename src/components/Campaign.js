import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Badge } from 'reactstrap';

import web3 from '../ethereum/web3';
import CrowdFundingContract from '../ethereum/crowdfunding';
import CampaignContractGenerator from '../ethereum/campaign';

import Check from './Check';
import Topnav from './Topnav';

class Campaign extends Component 
{
    constructor(props) {
        super(props);
        
        this.state = {
            campaign: null
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

            if(!registerFlag)
            {
                this.props.history.push("/");
            } 

        }
        else
        {
            this.props.history.push("/");
        }

        try
        {
            const CampaignContract = CampaignContractGenerator(
                this.props.match.params.address
            );

            const summary = await CampaignContract.methods.getSummary().call();

            this.setState({
                campaign: {
                    name: summary[0],
                    description: summary[1],
                    min: summary[2],
                    startDate: summary[3],
                    active: summary[4],
                    manager: summary[5],
                    balance: summary[6]
                }
            });
        }
        catch(err)
        {
            this.props.history.push("/");
        }
        
    }

    renderCampaign = () =>
    {
        if(this.state.campaign)
        {
            return (
                <div>
                    <div className="header" >
                        <div className="heading" >{this.state.campaign.name}</div>
                    </div>
                    <div className="description" >
                        {this.state.campaign.description}
                    </div>
                    <div className="description" >
                        Status: {
                            this.state.campaign.active
                            ?<Badge color="success" pill>Active</Badge>
                            :<Badge color="warning" pill>InActive</Badge>
                        }<br />
                        Campaign Start Date - {this.state.campaign.startDate}<br />
                        Contribution Required - {
                            web3.utils.fromWei(this.state.campaign.min, "ether")
                        } ether<br />
                        Campaign Balance - {
                            web3.utils.fromWei(this.state.campaign.balance, "ether")
                        } ether<br />
                        Manager - <span>{this.state.campaign.manager}</span>
                    </div>
                </div>
            );
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

                {this.renderCampaign()}

            </div>
        );
    }
}

export default withRouter(Campaign);
