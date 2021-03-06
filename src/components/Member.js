import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Badge } from 'reactstrap';

import web3 from '../ethereum/web3';
import CrowdFundingContract from '../ethereum/crowdfunding';

import Check from './Check';
import Topnav from './Topnav';

class Member extends Component 
{
    constructor(props) {
        super(props);
        
        this.state = {
            member: null
        }
    }
    
    async componentDidMount()
    {
        if(web3 !== 0)
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
                const account = this.props.match.params.address;

                const details = await CrowdFundingContract.methods
                                .getMember(account).call();

                this.setState({
                    member: {
                        name: details[0],
                        campaigns: details[1],
                        contributedCampaigns: details[2]
                    }
                });
                
            }
            catch(err)
            {
                this.props.history.push("/");
            }
        }
        else
        {
            window.location.assign("/");
        }
    }

    renderMember = () =>
    {
        if(this.state.member)
        {
            return (
                <div>
                    <div className="header" >
                        <div className="heading" >{this.state.member.name}</div>
                    </div>
                    <div className="description" >
                        <div style={{textAlign: "center", fontWeight: 800}} >
                            Campaigns&nbsp;
                            <Badge color="primary">
                                {this.state.member.campaigns.length}
                            </Badge>
                        </div>
                        <ul>
                        {
                            this.state.member.campaigns.map( campaign => {
                                return (
                                    <li 
                                        className="hoverable"
                                        key={campaign} 
                                        onClick={ () => this.props.history.push(
                                            `/campaign/${campaign}`
                                        ) }
                                    >
                                        {campaign}
                                    </li>
                                );
                            })
                        }
                        </ul>
                    </div>
                    <div className="description" >
                        <div style={{textAlign: "center", fontWeight: 800}} >
                            Contributions&nbsp;
                            <Badge color="primary">
                                {this.state.member.contributedCampaigns.length}
                            </Badge>
                        </div>
                        <ul>
                        {
                            this.state.member.contributedCampaigns.map( campaign => {
                                return (
                                    <li 
                                        className="hoverable"
                                        key={campaign} 
                                        onClick={ () => this.props.history.push(
                                            `/campaign/${campaign}`
                                        ) }
                                    >
                                        {campaign}
                                    </li>
                                );
                            })
                        }
                        </ul>
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

                {this.renderMember()}

            </div>
        );
    }
}

export default withRouter(Member);
