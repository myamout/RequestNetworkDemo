import { Element } from '@polymer/polymer/polymer-element.js';
import template from './template.html';

export class ViewRequests extends Element {
    static get properties() {
        return {
            testVar: { type: String, value: ""}
        };
    }

    static get template() {
        return template;
    }

    constructor() {
        super();
        this.testVar = "Testing...";
    }
}

customElements.define('view-requests', ViewRequests);
