import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { 
    Badge, Button, Card, CardText, CardTitle
} from 'reactstrap';

import web3 from '../ethereum/web3';
import CrowdFundingContract from '../ethereum/crowdfunding';
import CampaignContractGenerator from '../ethereum/campaign';

import Check from './Check';
import Topnav from './Topnav';

class Request extends Component 
{
    constructor(props) {
        super(props);
        
        this.state = {
            requestCount: null,
            isManager: null,
            requests: null
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

            const requestCount = await CampaignContract.methods.getRequestCount().call();

            const summary = await CampaignContract.methods.getSummary().call();

            const isManager = summary[5] === accounts[0];

            let requests;

            requests = await Promise.all(
                Array( Number(requestCount) )
                    .fill()
                    .map( (element, index) => {
                        return CampaignContract.methods.requests(index).call();
                    })
            );

            this.setState({
                requestCount,
                isManager,
                requests
            });
        }
        catch(err)
        {
            this.props.history.push("/");
        }

    }

    renderCreateSpendingRequestBtn = () =>
    {
        if(this.state.isManager)
        {
            return (
                <div style={{textAlign: "center", padding: 10}} >
                    <Button 
                        color="primary"
                        onClick = { () => this.props.history.push(
                            `/create-request/${this.props.match.params.address}`
                        ) }
                    >Create a Spending Request</Button>
                </div>
            );
        }
        else
        {
            return null;
        }
    }

    renderRequests = () =>
    {
        if(this.state.requests)
        {
            return this.state.requests.map( request => {
                return (
                    <Card 
                        body 
                        outline
                        color={ request.complete?"secondary":"primary" }
                        key={request.name} 
                        className="request-card" 
                    >
                        <CardTitle>{request.name}</CardTitle>
                        <CardText>
                            {request.description}
                            <br />
                            Amount of ether to be spent - {
                                web3.utils.fromWei(request.value, "ether")
                            } ether
                            <br />
                            Recipient address - {request.recipient}
                            <br />
                            Number of Approvals - {request.approvalCount}
                            <br />
                        </CardText>
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

                <div>
                    <div className="sub-heading" >
                        Spending Requests&nbsp;
                        <Badge color="primary">
                            {this.state.requestCount?this.state.requestCount:null}
                        </Badge>
                    </div>

                    <div>
                        {this.renderRequests()}
                    </div>

                    <div>
                        {this.renderCreateSpendingRequestBtn()}
                    </div>

                </div>
            </div>
        );
    }
}

export default withRouter(Request);
