import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Check from './Check';

import web3 from '../ethereum/web3';
import CrowdFundingContract from '../ethereum/crowdfunding';

import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

class Create extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            min: "",
            startDate: "",
            loading: false,
            error: ""
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
        }
        else
        {
            window.location.assign("/");
        }
    }

    onFormSubmit = async (event) =>
    {
        event.preventDefault();

        this.setState({
            error: "",
            loading: true
        });

        const minContribution = web3.utils.toWei(this.state.min, "ether");

        try
        {
            const accounts = await web3.eth.getAccounts();

            await CrowdFundingContract.methods.createCampaign(
                this.state.name,this.state.description,
                minContribution,this.state.startDate
            )
            .send({
                from: accounts[0]
            });

            this.props.history.push("/dashboard");
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
                    <div className="heading" >Start a New Campaign</div>
                </div>

                <div className="form-container" >
                    <Form onSubmit={this.onFormSubmit} >
                    <FormGroup>
                        <Label>Name of the Campaign</Label>
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
                        <Label>Description for the Campaign</Label>
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
                        <Label>Minimum Contribution for the Campaign(in ether)</Label>
                        <Input 
                            type="number" 
                            name="min" 
                            placeholder="Enter Amount of ether" 
                            value={this.state.min}
                            onChange={ (event) => {
                                this.setState({
                                    min: event.target.value
                                })
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Start Date of the Campaign</Label>
                        <Input 
                            type="date" 
                            name="startDate" 
                            placeholder="Enter Date" 
                            value={this.state.startDate}
                            onChange={ (event) => {
                                this.setState({
                                    startDate: event.target.value.toString()
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

export default withRouter(Create);
