# Request Network Demo
Demo using simple node scripts to run the Request Network JS Library
* Forked from the Request Team's JS Library repository on Github

## Prior Dependencies
To get everything up and running you're going to need Node and NPM. Installations differ between operating systems,
though if you're on MacOS I reccommend Homebrew which can be found here <https://brew.sh/>

## Ganache CLI and MetaMask
This demo focuses on running the example projects on the Ganache CLI and using MetaMask in the browser. To
install MetaMask go here <https://metamask.io/>. To install the Ganache CLI run `npm i -g ganache-cli`. This will
install the package globally across NPM so you can use it within multiple projects.

## Installing dependencies
- Within the root directory run `npm i`, this will install everything with the root `package.json` file.

## Running Ganache
- Run `npm run ganache` (this npm script can be found inside the `package.json` file)

## Running Smart Contract Tests
- This can be skipped but testing scripts are provided if you'd like to test the smart contracts
- Run `npm run test`

## Deploying The Contracts
- The Request Team has made some scripts that will go ahead and deploy all of the necessary Request contracts we will use
    to Ganache. Recently the team released an NPM module that holds all of the smart contract artifacts, that can be found here <https://github.com/RequestNetwork/requestNetwork/tree/master/packages/requestNetworkArtifacts> if you'd like to
    create your own migrations script, however for this Demo I'll be using the premade ones for ease of use.
- Run `npm run testdeploy`

## Connecting to MetaMask
- After running `npm run ganache` you should see an output: `candy maple cake sugar pudding cream honey rich smooth crumble     sweet treat`. Open the MetaMask extension, open the dropdown menu on the top left, and select `Localhost 8545`. Then 
    click restore from a seed. Copy and paste the long phrase from above and you should be good to go.

## Example Apps
The example applications can be found in the `examples` folder. Note that before running the example apps
you'll need to run Ganache and deploy the contracts first.
- SimpleP2P application: Create and pay requests. View open requests created by you or ones that you owe.
