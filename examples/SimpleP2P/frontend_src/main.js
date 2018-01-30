// import RequestNetwork from '@requestnetwork/request-network.js';
// import Web3 from 'web3';

// const rn = new RequestNetwork('http://localhost:8545', 45);
// const web3 = rn.requestEthereumService.web3Single.web3;
import { render, html } from '../node_modules/lit-html/lib/lit-extended';
import Eth from 'ethjs';
import RequestNetwork from '@requestnetwork/request-network.js';

import CreateRequest from './components/create-request';

customElements.define('create-request', CreateRequest);

const createRequestTemplate = () => {
    return html`
        <create-request></create-request>
    `;
}

render(createRequestTemplate(), document.getElementById('createrequest'));
