import Eth from 'ethjs';
import RequestNetwork from '@requestnetwork/request-network.js';
import { Element } from '@polymer/polymer/polymer-element.js';
import template from './template.html';

export class CreateRequest extends Element {

    static get properties() {
        return {
            payerAddress: { type: String },
            payeeAddress: { type: String },
            reason: { type: String },
            amountRequired: { type: Number },
            rn: { type: Object },
            eth: { type: Object }
        };
    }

    createRequest() {
        console.log(this.payerAddress);
        console.log(this.reason);
        console.log(this.amountRequired);
        this.payerAddress = '';
        this.reason = '';
        this.amountRequired = null;
    }

    constructor() {
        super();
    }

    static get template() {
        return template;
    }

}

customElements.define('create-request', CreateRequest);
