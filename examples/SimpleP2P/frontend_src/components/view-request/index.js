import Eth from 'ethjs';
import RequestNetwork from '@requestnetwork/request-network.js';
import { Element } from '@polymer/polymer/polymer-element.js';
import template from './template.html';

export class ViewRequests extends Element {
    static get properties() {
        return {
            payerAddress: { type: String },
            requestsAsPayee: { type: Array, value: [] },
            requestsAsPayer: { type: Array, value: [] },
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
            const requests = await this.rn.requestCoreService.getRequestsByAddress(this.payerAddress);
            this.requestsAsPayee = requests.asPayee;
            this.requestsAsPayer = requests.asPayer;
        } catch (error) {
            console.error(error);
        }
    }

    async getDetails(e) {
        this.rn.requestEthereumService.getRequest(e.model.item.requestId).then((data) => {
            this.$.reason.innerText = data.data.data.reason;
        }).catch((error) => {
            console.error(error);
        });
    }

    async testEvent(e) {
        console.log(e.model.item);
    }

    async loadBlockchainVars() {
        try {
            const ethereumjs = new Eth(window.web3.currentProvider);
            const requestNetwork = new RequestNetwork(window.web3.currentProvider, 45);
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
