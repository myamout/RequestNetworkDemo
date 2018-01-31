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

    async getRequests() {
        try {
            this.requestsAsPayee = [];
            this.requestsAsPayer = [];
            const requests = await this.rn.requestCoreService.getRequestsByAddress(this.payerAddress);
            let payeeArray = [];
            let payerArray = [];
            for (let req of requests.asPayee) {
                let requestObject = {};
                try {
                    let data = await this.rn.requestEthereumService.getRequest(req.requestId);
                    requestObject.payee = data.payee;
                    requestObject.payer = data.payer;
                    requestObject.reason = data.data.data.reason;
                    requestObject.expectedAmount = data.expectedAmount.words[0];
                    requestObject.requestId = data.requestId;
                    payeeArray.push(requestObject);
                } catch (error) {
                    console.error(error);
                }
            }
            for (let req of requests.asPayer) {
                let requestObject = {};
                try {
                    let data = await this.rn.requestEthereumService.getRequest(req.requestId);
                    requestObject.payee = data.payee;
                    requestObject.payer = data.payer;
                    requestObject.reason = data.data.data.reason;
                    requestObject.expectedAmount = data.expectedAmount.words[0];
                    requestObject.requestId = data.requestId;
                    payerArray.push(requestObject);
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

    async cancelRequest(event) {
        console.log(event);
    }

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
