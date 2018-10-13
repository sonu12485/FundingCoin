import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Check from './Check';

import web3 from '../ethereum/web3';
import CrowdFundingContract from '../ethereum/crowdfunding';
import CampaignContractGenerator from '../ethereum/campaign';

import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

class CreateRequest extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            value: "",
            recipient: "",
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

            const isManager = summary[5] === accounts[0];

            if(!isManager)
            {
                this.props.history.push("/");
            }
        }
        catch(err)
        {
            this.props.history.push("/");
        }
        
    }

    onFormSubmit = async (event) =>
    {
        event.preventDefault();

        this.setState({
            error: "",
            loading: true
        });

        try
        {
            const accounts = await web3.eth.getAccounts();

            const CampaignContract = CampaignContractGenerator(
                this.props.match.params.address
            );

            await CampaignContract.methods.createRequest(
                this.state.name,this.state.description,
                web3.utils.toWei(this.state.value, "ether"),this.state.recipient
            )
            .send({
                from: accounts[0]
            });

            this.props.history.push(
                `/request/${this.props.match.params.address}`
            );
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

    render() 
    {
        return (
            <div>
                <Check />

                <div className="header" >
                    <div className="heading" >Create a New Spending Request</div>
                </div>

                <div className="form-container" >
                    <Form onSubmit={this.onFormSubmit} >
                    <FormGroup>
                        <Label>Name of the Spending Request</Label>
                        <Input 
                            type="text" 
                            name="name" 
                            placeholder="Enter Name" 
                            value={this.state.name}
                            onChange={ (event) => {
                                this.setState({
                                    name: event.target.value
                                })
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Description for the Spending Request</Label>
                        <Input 
                            type="textarea" 
                            name="description" 
                            placeholder="Enter Description" 
                            value={this.state.description}
                            onChange={ (event) => {
                                this.setState({
                                    description: event.target.value
                                })
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Amonut of money to be spent (in ether)</Label>
                        <Input 
                            type="number" 
                            name="value" 
                            placeholder="Enter Amount of ether" 
                            value={this.state.value}
                            onChange={ (event) => {
                                this.setState({
                                    value: event.target.value
                                })
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Address of the Recipient</Label>
                        <Input 
                            type="text" 
                            name="recipient" 
                            placeholder="Enter Address" 
                            value={this.state.recipient}
                            onChange={ (event) => {
                                this.setState({
                                    recipient: event.target.value.toString()
                                })
                            }}
                        />
                    </FormGroup>
                    
                    <Button disabled={this.state.loading}
                        color="primary"
                    >Submit</Button>
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
}

export default withRouter(CreateRequest);
