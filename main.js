import RequestNetwork from './dist/src/requestNetwork';
import Web3 from 'web3';

const rn = new RequestNetwork('http://localhost:8545', 45);
const web3 = rn.requestEthereumService.web3Single.web3;
let accounts = [];
let payer = '';
let payee = '';
let currentNumRequest = '';
let requestID;
let paymentAmount = '';

const payRequest = async (requestID) => {
    const result = await rn.requestEthereumService.paymentAction(
        requestID,
        web3.toWei(50, 'ether'),
        0,
        {from: payer}
    ).on('broadcasted', (data) => {
        console.log(data.transaction.hash);
    });
    console.log(result);
    console.log('Request has been paid...');
    // Check account balances of the ones we've used.
    const payerBalance = await web3.eth.getBalance(payer);
    const payeeBalance = await web3.eth.getBalance(payee);
    console.log('Payer Balance: ' + payerBalance);
    console.log('Payee Balance: ' + payeeBalance);
};

const acceptRequest = async (requestID) => {
    console.log('REQUESTID' + requestID);
    const result = await rn.requestEthereumService.accept(
        requestID,
        {from: payer}
    ).on('broadcasted', (data) => {
        console.log(data.transaction.hash);
    });
    console.log('Request ID: ' + requestID + ' has been accepted, now calling payable function...');
    payRequest(requestID).catch((error) => {
        console.log(error);
    });
};

const createRequest = async () => {
    paymentAmount = 50;
    const result = await rn.requestEthereumService.createRequestAsPayee(
        payer,
        Eth,
        '{"reason": "Freelance work"}',
        '',
        [],
        {from:payee}
    ).on('broadcasted', (data) => {
        console.log(data.transaction.hash);
    });
    currentNumRequest = await rn.requestCoreService.getCurrentNumRequest();
    console.log('There are currently ' + currentNumRequest + ' active Requests');
    requestID = result.request.requestId;
    acceptRequest(requestID).catch((error) => {
        console.log(error);
    });
};

const mainAsync = async () => {
    try {
        // Get accounts active on Ganache
        accounts = await web3.eth.getAccounts();
        payer = accounts[1].toLowerCase();
        payee = accounts[2].toLowerCase();
        console.log(web3.eth.getBalance(payer));
        console.log(web3.eth.getBalance(payee));
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
