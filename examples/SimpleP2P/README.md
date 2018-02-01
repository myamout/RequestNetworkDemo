# SimpleP2P Example Using Request
## Showing off basic Request functionality

## Installing Dependencies
- Run `npm i`

## Bundling the frontend
Before accessing the application you'll need to use Webpack to bundle all of the
frontend code first.
- Run `npm run build`

## Running the server and accessing the app
The backend server for this example was written in Go. I've included the `server.go` file,
however the server isn't a crucial part of the application as all of the major functions
will be transactions on the block chain. I've included two binary files for running the server,
`server_linux` and `server_macos` each refering to your respective operating system. If you're
running on Windows the `server_linux` binary might work on Windows Subsystem Linux. For the server I used
the Echo Framework which can be found here <https://echo.labstack.com/guide>.
- Run `./server_'operating system here'`
- Open your browser and go to <localhost:3001>
- If you haven't logged into MetaMask do so now.

## Application Flow
- First you'll need to create a new account on MetaMask. Do so by going to the upper right dropdown and click on create new     account. Now you have access to the first two accounts created by Ganache.
- Under Account 1 fill in the required information and click "Create Request" (Use the address of Account 2).
- Refresh the page and you should be a new entry added under "Requests Created By You". From here you can cancel it if  
    you'd like.
- Now switch to Account 2 on MetaMask and then refresh the page. You should see a new entry under "Requests Owed By You".
    You can pay the request here. If you refresh the page after paying you should see that the entry is gone.

## Project Notes

### Ethjs vs Web3
As some might notice the Request Network uses Web3, however in this example I've elected to use Ethjs.
This is simply personal preference as both libraries serve the same function minus a few differences.
Ethjs uses promises which makes it easy to use with ES6 async/await functions, while Web3 uses callbacks.
If you'd like to use callbacks instead of promises you can run `npm i web3`.

### Polymer 3
For the frontend framework I decided to use Polymer 3. Again this is personal prefences, however in my
personal opinion is easier to follow than React, Angular, or Vue and definitely isn't as heavy size wise.
Polymer allows us to extrapolate our templates (HTML files) so our JavaScript class isn't cluttered with any render
functions. This lets us focus more on the Request Network library functions, which is what we came here to do.
Inside of the `template.html` files you might notice property variables inside of "{{}}". This is Polymer's two way data-binding, letting us render our property variables to our HTML.

### MetaMask Bug
There is a known bug, found here <https://github.com/MetaMask/metamask-extension/issues/1999>, where when reconnecting MetaMask to Ganache (for example when restarting Ganache after turning it off) MetaMask gets confused on the correct
nonce count. This in turn will give your errors when trying to execute transactions on the network because the nonce and transaction counts don't match. This is due to some caching that MetaMask does, however the team is currently working on a fix. To get around this error go into the root `package.json` and change the network id Ganache uses on the `ganache` script. This looks like `-i 45`. I have also noticed that if you want roughly a day MetaMask seems to reset itself and you can continue using the same network id.