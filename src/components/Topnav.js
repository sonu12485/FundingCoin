import React, { Component } from 'react';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
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
            isOpen: false
        }
    }
    
    toggle = () =>
    {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() 
    {
        return (
            <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/dashboard">FundingCoin</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                        Profile
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>
                                View Profile
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>
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

export default Topnav;