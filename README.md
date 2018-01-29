# Request Network Demo
Demo using simple node scripts to run the Request Network JS Library
* Forked from the Request Team's JS Library repository on Github

# Installation
- Run `npm i` in the root directory
- Run `npm i -g ganache-cli` to get the Ganache Testrpc to run a local test         
    blockchain

# Running Testrpc
- Run `npm run ganache` to start up the Testrpc

# Deploying Contracts
- Run `npm run testdeploy` to deploy the Request Network smart contracts to the Testrpc. Remember to run this from another terminal window.

# Running Node Scripts
Run `node main.js` to execute the provide Node.js script. This script will send a Request from one Testrpc account to another, accept the request, and then pay the request. This all happens in sequential order and demonstrates how one might set up these functions in a web application.

# Examples
Browse the example folders for some example projects. Make sure to start up Ganache and deploy the contracts before trying out the examples
