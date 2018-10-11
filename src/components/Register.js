import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Check from './Check';

import web3 from '../ethereum/web3';
import CrowdFundingContract from '../ethereum/crowdfunding';

import { Button, Form, FormGroup, Label, Input, FormText, Alert } from 'reactstrap';

class Register extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
            account: "",
            name: "",
            loading: false,
            error: ""
        }
    }
    
    async componentDidMount()
    {
        const accounts = await web3.eth.getAccounts();
        this.setState({
            account: accounts[0]
        });
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
            await CrowdFundingContract.methods.register(
                this.state.name,
                this.state.account
            )
            .send({
                from: this.state.account
            });

            this.props.history.push("/");
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
                    <div className="heading" >Register</div>
                </div>

                <div className="form-container" >
                    <Form onSubmit={this.onFormSubmit} >
                    <FormGroup>
                        <Label>Name</Label>
                        <Input 
                            type="text" 
                            name="name" 
                            placeholder="Enter Your UserName" 
                            value={this.state.name}
                            onChange={ (event) => {
                                this.setState({
                                    name: event.target.value
                                })
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Your Account Address</Label>
                        <Input 
                            type="text" 
                            name="account" 
                            value={this.state.account} 
                            disabled
                        />
                        <FormText color="muted">
                            To change the account address change the account in metamask.
                        </FormText>
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
                        <img src="img/loading.gif" alt="loading" />
                        <br />
                        <Alert color="primary">
                            Please Wait while your transaction is processed!!
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

export default withRouter(Register);
