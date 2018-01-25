import RequestNetwork from './dist/src/requestNetwork';
import Eth from 'ethjs';

const rn = new RequestNetwork('http://localhost:8545', 45, false);
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));
let accounts = [];

const mainAsync = async () => {
    try {
        accounts = await eth.accounts();
        console.log(accounts);
    } catch(error) {
        console.log(error);
    }
};

mainAsync().catch((error) => {
    console.log(error);
});
