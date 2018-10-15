import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import web3 from '../ethereum/web3';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem 
} from 'reactstrap';

class Topnav extends Component 
{
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen: false,
            address: null
        }
    }
    
    toggle = () =>
    {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    async componentDidMount()
    {
        if(web3 !== 0)
        {
            const accounts = await web3.eth.getAccounts();

            this.setState({
                address: accounts[0]
            });
        }
        else
        {
            window.location.assign("/");
        }
    }

    render() 
    {
        return (
            <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand
                    onClick={ () => this.props.history.push("/dashboard")}
                >FundingCoin</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                    <NavItem>
                        <NavLink
                            onClick={ () => this.props.history.push("/dashboard")}
                        >DashBoard</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink 
                            onClick={ () => this.props.history.push("/home")}
                        >Home</NavLink>
                    </NavItem>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                        Profile
                        </DropdownToggle>
                        <DropdownMenu right>
                            {
                                this.state.address
                                ?
                                <DropdownItem
                                    onClick={ () => this.props.history.push(
                                        `/member/${this.state.address}`
                                    ) }
                                >
                                    View Profile
                                </DropdownItem>
                                :null
                            }
                            <DropdownItem divider />
                            <DropdownItem onClick={ () => {
                                this.props.history.push("/change/name")
                            }}>
                                Change UserName
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </Navbar>
            </div>
        );
    }
}

export default withRouter(Topnav);