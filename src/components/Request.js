import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { 
    Badge, Button, Card, CardText, CardTitle, Alert
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
            requests: null,
            contributorsCount: null,
            hasContributed: null,
            account: null,
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

            const requestCount = await CampaignContract.methods.getRequestCount().call();

            const summary = await CampaignContract.methods.getSummary().call();

            const hasContributed = await CampaignContract.methods.isContributor(
                accounts[0]
            ).call();

            const isManager = summary[5] === accounts[0];
            const contributorsCount = summary[8];

            let requests;

            requests = await Promise.all(
                Array( Number(requestCount) )
                    .fill()
                    .map( (element, index) => {
                        return CampaignContract.methods.getRequest(index).call();
                    })
            );

            const processedRequests = requests.map( request => {
                return {
                    name: request[0],
                    description: request[1],
                    value: request[2],
                    recipient: request[3],
                    complete: request[4],
                    approvers: request[5],
                    approvalCount: request[6]
                }
            });

            this.setState({
                requestCount,
                isManager,
                requests: processedRequests,
                contributorsCount,
                hasContributed,
                account: accounts[0]
            });
        }
        catch(err)
        {
            this.props.history.push("/");
        }

    }

    renderCreateSpendingRequestBtn = () =>
    {
        if(this.state.isManager && this.state.contributorsCount > 0 )
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

    onApprove = async (index) =>
    {
        this.setState({
            error: "",
            loading: true
        });

        try
        {
            const CampaignContract = CampaignContractGenerator(
                this.props.match.params.address
            );

            await CampaignContract.methods
                .approveRequest(index)
                .send({
                    from: this.state.account
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

    renderApproveBtn = (index) =>
    {
        if(this.state.requests)
        {
            const temp = this.state.requests[index].approvers.find( approver => {
                return approver === this.state.account
            });

            if(!temp && this.state.hasContributed && !this.state.requests[index].complete)
            {
                return (
                    <div>
                        <br /><br />
                        <Button 
                            color="success" 
                            disabled={this.state.loading}
                            onClick = {() => this.onApprove(index)}
                        >
                            Approve
                        </Button>
                    </div>
                )
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

    renderApprovers = (index) =>
    {
        if(this.state.requests)
        {
            if(this.state.requests[index].approvalCount > 0)
            {
                return (
                    <div>
                        <div style={{fontSize: 24, textAlign: "center"}} >
                            Approvers
                        </div>
                        <ul style={{ fontSize: 20, padding: 5}} >
                        {
                            this.state.requests[index].approvers.map( approver => {
                                return (
                                    <li 
                                        className="hoverable"
                                        key={approver} 
                                        onClick={ () => this.props.history.push(
                                            `/member/${approver}`
                                        ) }
                                    >
                                        {approver}
                                    </li>
                                );
                            })
                        }
                        </ul>
                    </div>
                )
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

    onFinalize = async (index) =>
    {
        this.setState({
            error: "",
            loading: true
        });

        try
        {
            const CampaignContract = CampaignContractGenerator(
                this.props.match.params.address
            );

            await CampaignContract.methods
                    .finalizeRequest(index)
                    .send({
                        from: this.state.account
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

    renderFinalizeBtn = (index) =>
    {
        if(this.state.requests)
        {
            const request = this.state.requests[index];

            if(
                this.state.isManager 
                && 
                !request.complete 
                &&
                (request.approvalCount >= (Math.round(this.state.contributorsCount/2)))
            )
            {
                return (
                    <div>
                        <br /><br />
                        <Button 
                            color="success" 
                            disabled={this.state.loading}
                            onClick={ () => this.onFinalize(index) }
                        >
                            Finalize
                        </Button>
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

    renderStatus = (index) =>
    {
        if(this.state.requests)
        {
            const request = this.state.requests[index];

            if(request.complete)
            {
                return (
                    <Badge color="secondary" pill>Request Complete</Badge>
                );
            }
            else if(request.approvalCount >= (Math.round(this.state.contributorsCount/2)))
            {
                return(
                    <Badge color="success" pill>Waiting for Finalize</Badge>
                )
            }
            else
            {
                return (
                    <Badge color="primary" pill>Waiting for Approvals</Badge>
                );
            }
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
            return this.state.requests.map( (request,index) => {
                return (
                    <Card 
                        body 
                        outline
                        color={ 
                            request.complete
                            ?"secondary"
                            :(request.approvalCount >= (Math.round(this.state.contributorsCount/2)))
                            ?"success"
                            :"primary"
                        }
                        key={request.name} 
                        className="request-card" 
                    >
                        <CardTitle>{request.name}</CardTitle>
                        <CardText>
                            {request.description}
                            <br /><br />

                            <div style={{ fontSize: 22 }} >
                                Status - {this.renderStatus(index)}
                            </div>
                            <br />

                            Amount of ether to be spent - {
                                web3.utils.fromWei(request.value, "ether")
                            } ether
                            <br />
                            Recipient address - {request.recipient}
                            <br />
                            Number of Approvals - {request.approvalCount}
                            <br />
                            Number of Approvals Required - {this.state.contributorsCount}
                            
                            {this.renderApproveBtn(index)}
                            
                            {this.renderFinalizeBtn(index)}

                            <br />

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

                            {this.renderApprovers(index)}
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
