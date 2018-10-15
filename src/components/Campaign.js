import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Badge, Button, Form, FormGroup, FormText, Input, Alert } from 'reactstrap';

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
            campaign: null,
            hasContributed: false,
            isManager: false,
            amount: '',
            loading: false,
            error: ""
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

            const hasContributed = await CampaignContract.methods.isContributor(
                accounts[0]
            ).call();

            const isManager = summary[5] === accounts[0];

            this.setState({
                campaign: {
                    name: summary[0],
                    description: summary[1],
                    min: summary[2],
                    startDate: summary[3],
                    active: summary[4],
                    manager: summary[5],
                    balance: summary[6],
                    contributors: summary[7],
                    contributorsCount: summary[8]
                },
                hasContributed,
                isManager
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
                        Manager - <span
                            className="hoverable"
                            onClick={ () => this.props.history.push(
                                `/member/${this.state.campaign.manager}`
                            )}
                        >{this.state.campaign.manager}</span>
                    </div>
                </div>
            );
        }
        else
        {
            return null;
        }
    }

    onContribute = async (event) =>
    {
        event.preventDefault();

        this.setState({
            error: "",
            loading: true
        });

        try
        {
            const accounts = await web3.eth.getAccounts();

            await CrowdFundingContract.methods.contribute(
                this.props.match.params.address
            ).send({
                from: accounts[0]
            });

            const CampaignContract = CampaignContractGenerator(
                this.props.match.params.address
            );

            await CampaignContract.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.amount, "ether")
            });

            window.location.reload();
        }
        catch(err)
        {
            this.setState({
                loading: false,
                error: err.message
            });
        }

        this.setState({ loading: false });
    }

    renderContributeForm = () =>
    {
        if(this.state.campaign)
        {
            if(!this.state.hasContributed && !this.state.isManager)
            {
                return (
                    <div>
                    <div className="description" >
                        Be a Part of this Campaign -
                        <Form onSubmit={this.onContribute} >
                        <FormGroup>
                            <Input 
                                type="number" 
                                name="amount" 
                                placeholder="Enter Amount of ether you want to Contribute" 
                                value={this.state.amount}
                                onChange={ (event) => {
                                    this.setState({
                                        amount: event.target.value
                                    })
                                }}
                            />
                        </FormGroup>

                        <FormText color="muted" style={{fontSize: 14}} >
                            This will issue two transactions.Please accept both to contribute.
                        </FormText>

                        <Button
                            color="primary"
                            disabled={ 
                                this.state.amount < web3.utils.fromWei(this.state.campaign.min, "ether") 
                                ||
                                this.state.loading
                            }
                        >Contribute</Button>
                        </Form>
                    </div>
                    <div>
                    {
                        this.state.loading 
                        ?
                        <div className="loading">
                            <img src="/img/loading.gif" alt="loading" />
                            <br />
                            <Alert color="primary">
                                Please Wait while your transaction is being processed!!
                            </Alert>
                        </div>
                        :
                        null
                    }
                    {
                        !!this.state.error 
                        ?
                        <div className="loading">
                            <br />
                            <Alert color="danger">
                                {this.state.error}
                            </Alert>
                        </div>
                        :
                        null
                    }
                    </div>
                    </div>
                );
            }
            else
            {
                return null;
            }
        }
        else
        {
            return null;
        }
    }

    renderContributors = () =>
    {
        if(this.state.campaign)
        {
            return (
                <div>
                    <div className="description" >
                        <div style={{textAlign: "center", fontWeight: 800}} >
                            Contributors&nbsp;
                            <Badge color="primary">
                                {this.state.campaign.contributorsCount}
                            </Badge>
                        </div>
                        <ul>
                        {
                            this.state.campaign.contributors.map( contributor => {
                                return (
                                    <li 
                                        className="hoverable"
                                        key={contributor} 
                                        onClick={ () => this.props.history.push(
                                            `/member/${contributor}`
                                        ) }
                                    >
                                        {contributor}
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

    renderSpendingRequests = () =>
    {
        if(this.state.campaign)
        {
            return (
                <div
                    style={{
                        textAlign: "center",
                        paddingBottom: 20
                    }}
                >
                    <Button
                        color="primary"
                        onClick={ () => this.props.history.push(
                            `/request/${this.props.match.params.address}`
                        )}
                    >
                        Spending Requests
                    </Button>
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

                {this.renderContributeForm()}

                {this.renderContributors()}

                {this.renderSpendingRequests()}

                <br /><br /><br /><br /><br /><br /><br /><br />
            </div>
        );
    }
}

export default withRouter(Campaign);
