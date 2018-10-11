import React, { Component } from 'react';

import { Modal, ModalHeader, ModalBody} from 'reactstrap';

import web3 from '../ethereum/web3';

class Check extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
            metamask: true,
            rinkeby: true
        }
    }
    
    componentDidMount()
    {
        if(web3 === 0)
        {
            this.setState({
                metamask: false
            });
        }
        else
        {
            web3.eth.net.getNetworkType()
                .then( net => {
                    if(net !== "rinkeby")
                    {
                        this.setState({
                            rinkeby: false
                        });
                    }
                });
        }
    }

    render() 
    {
        return (
            <div>
                <Modal isOpen={!this.state.rinkeby && this.state.metamask} backdrop={"static"}>
                <ModalHeader>Please Change To Rinkeby Test Network</ModalHeader>
                <ModalBody>
                    Our app works on Ethereum Rinkeby Test Network.
                    <br />
                    <br />
                    So, to use this app Please open your metamask extension and change to Rinkeby Test Network.
                </ModalBody>
                </Modal>

                <Modal isOpen={!this.state.metamask} backdrop={"static"}>
                <ModalHeader>Please Install Metamask chrome extension</ModalHeader>
                <ModalBody>
                    To Use our app Please go to chrome web store and add Metamask as you Chrome extension.
                    <br />
                    <br />
                    To Install Metamask go to this link -
                    <br />
                    <a 
                        href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" 
                        target="_blank"
                    >
                        Install Metamask
                    </a>
                </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default Check;
