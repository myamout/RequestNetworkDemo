import RequestNetwork from './dist/src/requestNetwork';
import Web3 from 'web3';

const rn = new RequestNetwork('http://localhost:8545', 45);
const web3 = rn.requestEthereumService.web3Single.web3;
let accounts = [];
let payer = '';
let payee = '';
let currentNumRequest = '';

const createRequest = async () => {
    const result = await rn.requestEthereumService.createRequestAsPayee(
        payer,
        1500,
        '{"reason": "Freelance work"}',
        '',
        [],
        {from:payee}
    ).on('broadcasted', (data) => {
        console.log(data.transaction.hash);
    });
    console.log(result);
    currentNumRequest = await rn.requestCoreService.getCurrentNumRequest();
    console.log('There are currently ' + currentNumRequest + ' active Requests');
};

const mainAsync = async () => {
    try {
        // Get accounts active on Ganache
        accounts = await web3.eth.getAccounts();
        payer = accounts[2].toLowerCase();
        payee = accounts[3].toLowerCase();
        currentNumRequest = await rn.requestCoreService.getCurrentNumRequest();
        createRequest().catch((error) => {
            console.log(error);
        });
    } catch(error) {
        console.log(error);
    }
};

mainAsync().catch((error) => {
    console.log(error);
});
