import React from 'react';
import ViewRequests from './view-requests.jsx';

import RequestNetwork from '@requestnetwork/request-network.js';
import Web3 from 'web3';
import Eth from 'ethjs';

export default class CreateRequest extends React.Component {

    constructor() {
        super();
        this.state = {
            payeeAddress: '',
            payerAddress: '',
            amountRequired: 0,
            reason: '',
        };
        window.requestnetwork = new RequestNetwork(window.web3.currentProvider, 45);
        window.ethereumjs = new Eth(window.web3.currentProvider);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleReasonChange = this.handleReasonChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleAddressChange(event) {
        this.setState({
            payerAddress: event.target.value.trim()
        });
    }

    handleAmountChange(event) {
        this.setState({
            amountRequired: event.target.value
        });
    }

    handleReasonChange(event) {
        this.setState({
            reason: event.target.value
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.payerAddress);
        console.log(this.state.amountRequired);
        console.log(this.state.reason);
        this.setState({
            payerAddress: '',
            amountRequired: 0,
            reason: ''
        });
    }

    async printTestRPCAccount() {
        console.log(window.requestnetwork);
    }

    render() {
        return (
            <div> 
                <div className="row center"> 
                    <h1> Create A Request </h1>
                    <input type="text" value={this.state.payerAddress} onChange={this.handleAddressChange} placeholder="Address to request ETH from" />
                    <input type="number" value={this.state.amountRequired} onChange={this.handleAmountChange} placeholder="Amount of ETH to Send" />
                    <input type="text" value={this.state.reason} onChange={this.handleReasonChange} placeholder="Reason for request" />
                    <button type="button" onClick={this.handleSubmit}> Create Request </button>
                    <button type="button" onClick={this.printTestRPCAccount}> Test Web3 </button>
                </div>
                <div className="row center">
                    <ViewRequests />
                </div>
            </div>
        )
    }

}
