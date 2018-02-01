import Eth from 'ethjs';
import RequestNetwork from '@requestnetwork/request-network.js';
import { Element } from '@polymer/polymer/polymer-element.js';
import template from './template.html';

export class CreateRequest extends Element {

    /*
    *   Similar to state variables in React
    *   These hold the class wide variables we'll need for the project
    */
    static get properties() {
        return {
            payerAddress: { type: String },
            payeeAddress: { type: String },
            reason: { type: String },
            amountRequired: { type: Number },
            rn: { type: Object },
            eth: { type: Object },
            txHash: { type: String },
        };
    }

    /*
    *   Creates a Request.
    *   createRequestAsPayee function takes in:
    *   Address you're charging, amount you want to charge, reason of charge (this needs to be in JSON format),
    *   Extension conract, extension parameters, and options. Options can include gas, numberOfConfirmations, but at
    *   the minimum needs the from address.
    */
    async createRequest() {
        try {
            const result = await this.rn.requestEthereumService.createRequestAsPayee(
                this.payerAddress,
                this.amountRequired,
                `{"reason": "${ this.reason }"}`,
                '',
                [],
                { from: this.payeeAddress }
            ).on('broadcasted', (data) => {
                console.log(data.transaction.hash);
                this.txHash = data.transaction.hash;
            });
        } catch (error) {
            console.error(error);
        }
    }

    /*
    *   Set our Eth variable
    *   Set our Request Network variable
    */
    async loadBlockchainVars() {
        try {
            const ethereumjs = new Eth(window.web3.currentProvider);
            const requestNetwork = new RequestNetwork(window.web3.currentProvider, 46);
            let accounts = await ethereumjs.accounts();
            this.payeeAddress = accounts[0];
            this.rn = requestNetwork;
            this.eth = ethereumjs;
        } catch (error) {
            console.error(error);
        }
    }

    constructor() {
        super();
        this.loadBlockchainVars();
    }

    /*
    *   Renders out the template.html file within this folder
    */
    static get template() {
        return template;
    }

}

customElements.define('create-request', CreateRequest);
