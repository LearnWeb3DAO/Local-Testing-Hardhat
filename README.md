# Local Blockchain Tutorial

This tutorial should familiarize you with creating a local blockchain using Hardhat, deploying a sample smart contract to the local blockchain you have deployed, and interact with that blockchain with metamask and web3 react.

We will make two directories: a `blockchain` directory that will hold our hardhat configuration and smart contract code, and an `app` directory that will hold our web app to interact with our blockchain.

# Local Blockchain

First, create the blockchain directory

`mkdir blockchain`
`cd blockchain`

Then, we need to install hardhat. In these examples, we will use `npm`, but you can use `yarn` if you wish. If you do not have `npm` or `node.js` installed, refer [node.js download page](https://nodejs.org/en/download)

To install hardhat, run `npm install --save-dev hardhat`.

Then, to initialize a hardhat project, run `npx hardhat`, and select "create basic sample project".

Next, we'll want to install all the necessary dependencies that hardhat requires. We'll be using typescript here, so that we can generate types for our smart contracts later.

`npm install --save-dev ethers @typechain/hardhat ts-node typescript @types/node @types/mocha @nomiclabs/hardhat-waffle ethereum-waffle typechain ts-generator @typechain/ethers-v5`

When that has been installed, create a `tsconfig.json` file. This is a fie that tells typescript how to compile your code. The file should contain the following:

```TSX
{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "strict": true,
        "esModuleInterop": true,
        "outDir": "dist"
    },
    "include": ["./scripts", "./test"],
    "files": [
        "./hardhat.config.ts"
    ],
}
```

rename `hardhat.config.js` to `hardhat.config.ts`. This is because we're using typescript. You can do this with `mv hardhat.config.js hardhat.config.ts`. Next, the file should contain the following:

```TSX
import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.0", settings: {} }],
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
  }
};
export default config;
```

This file does a few things. First, it declares the solidity version that our local blockchain will use (0.8.0 in this case). Second, it declares the chain ID of our network.

We'll also need to create a deployment script for our smart contract. To do that, create a file `scripts\deploy.ts`, and place the following contents into it:

```TSX
import { ethers } from "hardhat"

async function main() {
  // deploy Greeter contract
  const greeterFactory = await ethers.getContractFactory('Greeter')
  const contract = await greeterFactory.deploy("Hello, Hardhat!")
  console.log('Greeter Contract Address = ', contract.address)
  console.log('Greeter Txn Hash = ', contract.deployTransaction.hash)
  console.log('Deployed By = ', contract.deployTransaction.from)
  await contract.deployed()
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
```

This instantiates the greeter contract using the ethers contract factory. Then, it deploys this contract onto the given blockchain, then prints information about that deployment.

The basic hardhat project also comes with a sample smart contract. We'll be using this smart contract in our example. You should see this contract in `contracts\Greeter.sol`. It should look something like this:

```Solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {
    string private greeting;

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
    }
}

```

This contract declares a string for storage, `greeting`. There are also two methods and a constructor. The constructor acts like any other language, instantiating the greeting with a provided string value. We will see this in action later.

The `greet` method returns the greeting string. Since this is a `view`, this costs no gas, and requires no singing.
The `setGreeting` method sets the greeting string with a provided user value. Since this updates the smart contract state, it costs gas, and requires singing.

To compile this contract (and also generate types for it because we included typechain) run `npx hardhat compile`. You should see some new folders after running this, namely `artifacts`, `cache`, and `typechain-types`.

What we've created here is a node, that we can run locally. To deploy the node, you can run `npx hardhat node`. This will start the node and keep it running until you kill it.

In another terminal window, navigate to the same `blockchain` directory and run `npx hardhat run --network localhost scripts\deploy.ts`. This deploys the smart contract to the running node. You should it compile the smart contracts, and have a message like:

```Shell
Greeter Contract Address =  0x5FbDB2315678afecb367f032d93F642f64180aa3
Greeter Txn Hash =  0xf0566602dbdc7293fa95a29ca0d3d37ba604763969825b661f2c49bb270edbb6
Deployed By =  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

You should record the greeter contract address for later use.

In the other terminal window, where the node is running, you should see a message like this:

```Shell
  Contract deployment: Greeter
  Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3
  Transaction:         0xf0566602dbdc7293fa95a29ca0d3d37ba604763969825b661f2c49bb270edbb6
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  Value:               0 ETH
  Gas used:            505416 of 505416
  Block #1:            0x91fb10ea115f4823249f723dd1d7f039985d02fc6ae804b791333c92e4a7105e

  console.log:
    Deploying a Greeter with greeting: Hello, Hardhat!
```

Congratulations! You now have a local blockchain running. You should also see several ETH wallets with their private keys displayed. These are test wallets that hardhat generates for you so that you can test various smart contracts. It goes without saying that this money is not real.

## Metamask Connection

To use metamask to connect to this network, navigate to Metamask, click on the network, and then choose `Add Network`. Another window will pop up, with 5 fields you have to fill in.

- Network Name: put whatever you like here. I prefer to name this localhost.
- Chain ID: use 1337 as that is the chain ID we have defined.
- New RPC URL: use `http://localhost:8545` as by default hardhat runs on port 8545.
- Currency Symbol: use `ETH` here as we'll be using ethereum.
- Block Explorer URL: you can leave this blank.

Once that is done, you can switch to that network in metamask. Let's add one of the pre-generated accounts to it. 

In the node terminal, you should see several accounts displayed. Let's grab one of those:

```Shell
Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

Go to metamask --> accounts --> import account. Select private key in the dropdown and paste the private key from the account you wish. In this case, we paste `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`. You should now see an account with 10000 ETH, and the account should be `0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266`

# Web App
To interact with our newly deployed blockchain locally, we will create a sample web3 react project. We will be using typescript here as well.

To start, make sure that you are back in the root directory (above the `blockchain` directory). To create the project, run `npx create-react-app my-app --template typescript`. If you're using `yarn`, you can run `yarn create react-app my-app --template typescript`

You can verify this worked by:

`cd app`
`npm start` or `yarn start` (again, we will be using npm in this tutorial)

You should see a basic react page with a logo and a link at `localhost:3000`. When you have verified that this is the case, kill the app.

Next, we'll want to install some dependencies with 
`npm install --save-dev --legacy-peer-deps ethers web3 web3-react` and `npm install @web3-react/core @web3-react/injected-connector`.

Once you have done that, create a file named `.env` and put the following into it:

```
REACT_APP_SMART_CONTRACT_ADDRESS=
```

At the other end of that equal sign, put in the greeter contract address you recorded earlier.

Then, navigate back to the `blockchain` directory and copy over the artifacts that were compiled by hardhat:

```Shell
cd ../blockchain
cp -r typechain-types ../app/src
cp -r artifacts ../app/src
cp -r cache ../app/src
```

This way, you can use your smart contract as a type in your react code.

We'll need a few boilerplate items to work with web3 and metamask. Create a `utils` folder.

## Connectors

Create a `connectors.ts` file in the `utils` folder. Its contents should be:

```TSX
/**
* A file including wallet connectors from Web3-React
*/

import { InjectedConnector } from '@web3-react/injected-connector'

export const injected = new InjectedConnector({
    supportedChainIds: [
        1, // Mainnet
        3, // Ropsten
        4, // Rinkeby
        5, // Goerli
        42, // Kovan
        1337, // Local
    ],
})
 
```

You can think of a connector as the thing connecting you to a certain wallet. In this case, we will be using this to connect to metamask. Note that it has the chain IDs for all the major chains on Ethereum, with `1` being main chain and the rest as test chains. You can see our local chain is last with a chain ID of `1337` which we previous declared in `hardhat.config.ts`

## Hooks

Create a `hooks.ts` file in the `utils` folder. Its contents should be:

```TSX
import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { injected } from './connectors'

export function useEagerConnect() {
  const { activate, active } = useWeb3React()
  const [tried, setTried] = useState(false)

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
  }, []) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}

export function useInactiveListener(suppress: boolean = false) {
  const { active, error, activate } = useWeb3React()

  useEffect((): any => {
    const { ethereum } = window as any
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event")
        activate(injected)
      }
      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId)
        activate(injected)
      }
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts)
        if (accounts.length > 0) {
          activate(injected)
        }
      }
      const handleNetworkChanged = (networkId: string | number) => {
        console.log("Handling 'networkChanged' event with payload", networkId)
        activate(injected)
      }

      ethereum.on('connect', handleConnect)
      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)
      ethereum.on('networkChanged', handleNetworkChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect)
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
          ethereum.removeListener('networkChanged', handleNetworkChanged)
        }
      }
    }
  }, [active, error, suppress, activate])
}

```

Now, this is a pretty long file for boilerplate. Let's go through it.

This file exports two functions: `useEagerConnect` and `useInactiveListener`.

### useEagerConnect

This function is a way for react to automatically connect to your metamask wallet if a connection has been established before.

### useInactiveListener

This function is a way for react to listen to events from the ethereum connector, in this case metamask. It lets us handle four events:

- `handleConnect` to handle connecting to the blockchain
- `handleChainChanged` to handle changing between chains
- `handleAccountsChanged` to handle changing your active account in your wallet
- `handleNetworkChanged` to handle changing between networks

## Misc

Create a `misc.ts` file in the `utils` folder. Its contents should be:

```TSX
import { Web3Provider } from '@ethersproject/providers'

export function getLibrary(provider: any): Web3Provider {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
}
```

This function lets us export the web3 provider. This provider is going to used in a wrapper around our react app that injects web3 functionality into our app.

## index.tsx

Navigate to `index.tsx` and make sure that `<App />` is surrounded with `<Web3ReactProvider getLibrary={getLibrary}></Web3ReactProvider>`. Nothing else should change. The end result should look like this:

```TSX
import React from 'react'
import ReactDOM from 'react-dom'
import { Web3ReactProvider } from '@web3-react/core'

import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { getLibrary } from './utils/misc'

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
```

## App.tsx

Now, we are ready to code up our app to interact with the blockchain.

Let's import everything we need.

```TSX
import { useEffect, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Greeter__factory as GreeterFactory } from './typechain-types/factories/Greeter__factory'
import { Greeter } from './typechain-types/Greeter'
import { injected } from './utils/connectors'
import { useEagerConnect, useInactiveListener } from './utils/hooks'
import { Signer } from '@ethersproject/abstract-signer'
```

Here, we import our hooks and connectors from above, as well as some basic react pieces. As well, we're importing some web3 functionality.

Finally, we're also importing the generated types from our smart contract. With `Greeter` and `Greeter__factory`, we get auto complete and type safety using our smart contracts.

Next, we want to load the address of our smart contract from our environment configuration.

```TSX
const contractAddress = process.env.REACT_APP_SMART_CONTRACT_ADDRESS
```

Let's define our app:

```TSX
const WalletApp = () => {
  return (
    <div></div>
  )
}
export default WalletApp
```

Inside the `WalletApp`, define some variables that we'll use throughout the app:

```TSX
const [contract, setContract] = useState(undefined as Greeter|undefined)
const { chainId, account, activate, deactivate, active, library } = useWeb3React<Web3Provider>()
```

`contract` and `setContract` is a getter and setter for our Greeter smart contract.

`chainId`, `account`, `activate`, `deactivate`, `active`, `library` are all web3 components we will be using throughout the app. Since we injected the web3 library above this app, we can automatically pull the chainId of the blockchain and the account on metamask. The activate and deactivate methods can be called to connect or disconnect a wallet. Finally, active is a boolean that indicates whether the wallet connection is active, and library is used to sign transactions.

In order to automatically connect to metamask, we can use the following code:

```TSX
const triedEager = useEagerConnect()
useInactiveListener(!triedEager)
```

On initial load, the `contract` is going to be undefined. To initialize it, we need to make use of react's `useEffect()` hook.

```TSX
useEffect(() => {
  if (!contractAddress) {
    throw new Error('Must set contract address as env var')
  }

  setContract(GreeterFactory.connect(contractAddress, library?.getSigner(account as string) as Signer))
}, [account, chainId, library])

const _connectToMetamask = () => {
  activate(injected)
}
```

The useEffect hook runs on every re-render. You can provide it with a set of variables to watch, and when those change, the effect is triggered. In this case, when `account`, `chainId` or `library` change, we re-initialize the contract.

Looking at the `return` call, let's put something into that div to render it.

```TSX
<div>
  <div>ChainId: {chainId}</div>
  <div>Account: {account}</div>
  {active ? (
    <div>
      ✅
      <button onClick={() => deactivate()}>
        deactivate
      </button>
      <br />
      <button onClick={_getGreeting}>Get Greeting</button>
      <button onClick={_setHelloGreeting}>Set Hello Greeting</button>
      <button onClick={_setGoodbyeGreeting}>Set Goodbye Greeting</button>
    </div>
  ) : (
    <button type="button" onClick={_connectToMetamask}>
      Connect
    </button>
  )}
</div>
```

Here, we're displaying the chainId and the account. If active (meaning an account is connected) we display 4 buttons:
- deactivate to disconnect from the wallet
- get greeting to return the greeting string from the smart contract
- set greeting to a hello message on the smart contract
- set greeting to a goodbye message on the smart contract

If not active, just display one button:
- connect, in order to connect to a wallet

Since we do not have these functions yet, let's define them

`_connectToMetamask` will call the activate method from `useWeb3React`

```TSX
const _connectToMetamask = () => {
  activate(injected)
}
```

To get greeting, we will call the smart contract with the type we have initialized:

```TSX
const _getGreeting = async () => {
  if (active && !!contract) {
    try {
      console.log("_getGreeting")
      console.log(contract)
      const resp = await contract?.functions.greet()
      console.log(resp)
    } catch (err) {
      console.error(err)
    }
  }
}
```

If you have an autocomplete feature, notice how you can view all functions on the contract when you type `contract?.functions.`

Similarly, let's create two functions to set the greeting on the contract:

```TSX
const _setHelloGreeting = async () => {
  if (active && !!contract) {
    try {
      console.log("_setHelloGreeting")
      console.log(contract)
      const resp = await contract?.functions.setGreeting("Hello World!")
      console.log(resp)
    } catch (err) {
      console.error(err)
    }
  }
}

const _setGoodbyeGreeting = async () => {
  if (active && !!contract) {
    try {
      console.log("_setGoodbyeGreeting")
      console.log(contract)
      const resp = await contract?.functions.setGreeting("Goodbye World!")
      console.log(resp)
    } catch (err) {
      console.error(err)
    }
  }
}
```

When all of this is done, your file should look a lot like this:

```TSX
import { useEffect, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Greeter__factory as GreeterFactory } from './typechain-types/factories/Greeter__factory'
import { Greeter } from './typechain-types/Greeter'
import { injected } from './utils/connectors'
import { useEagerConnect, useInactiveListener } from './utils/hooks'
import { Signer } from '@ethersproject/abstract-signer'

// Update with the contract address logged out to the CLI when it was deployed
// NOTE: the contract address must match the network MetaMask is connected to
const contractAddress = process.env.REACT_APP_SMART_CONTRACT_ADDRESS

const WalletApp = () => {
  const [contract, setContract] = useState(undefined as Greeter|undefined)
  const { chainId, account, activate, deactivate, active, library } = useWeb3React<Web3Provider>()

  // auto-connect connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager)

  useEffect(() => {
    if (!contractAddress) {
      throw new Error('Must set contract address as env var')
    }

    setContract(GreeterFactory.connect(contractAddress, library?.getSigner(account as string) as Signer))
  }, [account, chainId, library])

  const _connectToMetamask = () => {
    activate(injected)
  }

  const _getGreeting = async () => {
    if (active && !!contract) {
      try {
        console.log("_getGreeting")
        console.log(contract)
        const resp = await contract?.functions.greet()
        console.log(resp)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const _setHelloGreeting = async () => {
    if (active && !!contract) {
      try {
        console.log("_setHelloGreeting")
        console.log(contract)
        const resp = await contract?.functions.setGreeting("Hello World!")
        console.log(resp)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const _setGoodbyeGreeting = async () => {
    if (active && !!contract) {
      try {
        console.log("_setGoodbyeGreeting")
        console.log(contract)
        const resp = await contract?.functions.setGreeting("Goodbye World!")
        console.log(resp)
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <div>
      <div>ChainId: {chainId}</div>
      <div>Account: {account}</div>
      {active ? (
        <div>
          ✅
          <button onClick={() => deactivate()}>
            deactivate
          </button>
          <br />
          <button onClick={_getGreeting}>Get Greeting</button>
          <button onClick={_setHelloGreeting}>Set Hello Greeting</button>
          <button onClick={_setGoodbyeGreeting}>Set Goodbye Greeting</button>
        </div>
      ) : (
        <button type="button" onClick={_connectToMetamask}>
          Connect
        </button>
      )}
    </div>
  )
}

export default WalletApp
```

Now, you can run the node with `npx hardhat node` in one terminal window in the `blockchain` folder, and run the app with `npm start` in the `app` folder and go to `localhost:3000`. Connect your metamask to the app and you're all set to interact with it!

Notice that we print all results to the console rather than the app itself. This could be improved upon if you wish. For now, open the developer console in whatever browser you prefer to see the smart contract interactions.

Notice that you get hit `Get Greeting` as many times as you want. When you click `Set Hello Greeting` or `Set Goodbye Greeting`, metamask will ask you to sign this transaction and pay a gas fee to process it. Wait until you get a notification of the transaction completing, and then you should see a different greeting returned when you hit `Get Greeting`

Congratulations! You have just created and end-to-end web3 app with a local blockchain!

# Further Reading

If you're interested in reading more about the tools used in this tutorial, as well as useful blockchain tools in general, check out the following resources.

* [`Web3-React`](https://github.com/NoahZinsmeister/web3-react)
    * Can use injected `web3` directly if you prefer but `web3-react` simplifies some React related features
* [`Ethers.js`](https://docs.ethers.io/v5/)
* [`Hardhat`](https://hardhat.org/getting-started/)
    * Can run an Ethereum network on localhost
    * Alternatively, use [`Ganache`](https://www.trufflesuite.com/ganache) from the `truffle-suite` instead
* [`Typechain`](https://github.com/dethcrypto/TypeChain)
    * To auto-generate Typescript interfaces for smart contracts and a useful CLI for deploying the contract
* [`Truffle`](https://trufflesuite.com/)
    * For easy smart contract testing

