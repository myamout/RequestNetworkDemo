/*
*   Polymer related documentation can be found in the create-request folder.
*   Documentation here will focus on the Request Library functions
*/ 

import Eth from 'ethjs';
import RequestNetwork from '@requestnetwork/request-network.js';
import { Element } from '@polymer/polymer/polymer-element.js';
import template from './template.html';

export class ViewRequests extends Element {
    static get properties() {
        return {
            payerAddress: { type: String },
            requestsAsPayee: { type: Array },
            requestsAsPayer: { type: Array },
            paymentAmount: { type: Number },
            additionalAmount: { type: Number },
            rn: { type: Object },
            eth: { type: Object },           
        };
    }

    static get template() {
        return template;
    }

    /*
    *   This function grabs all of the open requests for the current address in Metamask
    *   We will grab all the requests the user has created, owes, and display them accordingly
    */
    async getRequests() {
        try {
            // Returns object with two arrays, requests as Payee and as Payer
            const requests = await this.rn.requestCoreService.getRequestsByAddress(this.payerAddress);
            let payeeArray = [];
            let payerArray = [];
            // Both for loops go through each array to grab all of the needed information
            // from each request. (getRequestsByAddress function just returns the requestId)
            // the getRequest function returns a lot more detail.
            for (let req of requests.asPayee) {
                let requestObject = {};
                try {
                    let data = await this.rn.requestEthereumService.getRequest(req.requestId);
                    // We only want to store requests in the created state.
                    // Potentially a future dashboard can show cancelled and paid requests as well
                    if (data.state === 0) {
                        requestObject.payee = data.payee;
                        requestObject.payer = data.payer;
                        requestObject.reason = data.data.data.reason;
                        requestObject.expectedAmount = data.expectedAmount.words[0];
                        requestObject.requestId = data.requestId;
                        payeeArray.push(requestObject);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            for (let req of requests.asPayer) {
                let requestObject = {};
                try {
                    let data = await this.rn.requestEthereumService.getRequest(req.requestId);
                    if (data.state === 0) {
                        requestObject.payee = data.payee;
                        requestObject.payer = data.payer;
                        requestObject.reason = data.data.data.reason;
                        requestObject.expectedAmount = data.expectedAmount.words[0];
                        requestObject.requestId = data.requestId;
                        payerArray.push(requestObject);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            this.requestsAsPayee = payeeArray;
            this.requestsAsPayer = payerArray;
        } catch (error) {
            console.error(error);
        }
    }

    /*
    *   Function will cancel a request.
    *   Cancel function just takes in the requestId
    */
    async cancelRequest(event) {
        try {
            let requestObject = event.model.item;
            console.log(`Canceling Request ID: ${ requestObject.requestId }...`);
            this.rn.requestEthereumService.cancel(
                requestObject.requestId,
                {from: this.payerAddress}
            ).on('broadcasted', (data) => {
                console.log(`Tx Hash: ${ data.transaction.hash }...`);
            });
            this.getRequests();
        } catch (error) {
            console.error(error);
        }
    }

    /*
    *   Function pays a request
    *   Note that if the address calling this function is the "payer" address
    *   the Request will be automatically accepted saving us a function call and a transaction.
    *   paymentAction function takes in the: requestId, amount need (this needs to be converted to Wei),
    *   additional ether to send (this is set to zero), and options. Just like creating a request the options need
    *   to include at least the from parameter
    */
    async payRequest(event) {
        const requestObject = event.model.item;
        try {
            const result = await this.rn.requestEthereumService.paymentAction(
                requestObject.requestId,
                Eth.toWei(requestObject.expectedAmount, 'ether'),
                0,
                {from: this.payerAddress}
            ).on('broadcasted', (data) => {
                console.log(`Tx Hash Payment Action: ${ data.transaction.hash }`);
            });
            console.log(result);
            console.log(`Request ID: ${ requestObject.requestId } has been paid...`);
            this.getRequests();
        } catch (error) {
            console.error(error);
        }
    }

    /*
    *   Provides same function as from create-request folder, though
    *   this function adds obtatining the open requests
    */
    async loadBlockchainVars() {
        try {
            const ethereumjs = new Eth(window.web3.currentProvider);
            const requestNetwork = new RequestNetwork(window.web3.currentProvider, 46);
            let accounts = await ethereumjs.accounts();
            this.payerAddress = accounts[0];
            this.rn = requestNetwork;
            this.eth = ethereumjs;
            this.getRequests();
        } catch (error) {
            console.error(error);
        }
    }

    constructor() {
        super();
        this.loadBlockchainVars();
    }
}

customElements.define('view-requests', ViewRequests);
