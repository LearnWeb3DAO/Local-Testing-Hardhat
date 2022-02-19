# Local Blockchain Tutorial

This tutorial should familiarize you with using a local blockchain using Hardhat, deploying a sample smart contract to the local blockchain, and interacting with that blockchain with metamask and Remix.

---

### Why local blockchain?

- It is very useful to run a local blockchain because testing becomes very fast and efficient.
- Its only your machine which is running the blockchain and thus consensus is fast and you dont have to wait for other nodes to sync or validate.
- You can also use many specialized modules specially built for local testing like [Hardhat console.log](https://hardhat.org/tutorial/debugging-with-hardhat-network.html) which helps you to add printing inside your contract.

---

## Build

To build the smart contract we would be using [Hardhat](https://hardhat.org/). Hardhat is an Ethereum development environment and framework designed for full stack development in Solidity. In simple words you can write your smart contract, deploy them, run tests, and debug your code.

- To setup a Hardhat project, Open up a terminal and execute these commands

  ```bash
  npm init --yes
  npm install --save-dev hardhat
  ```

- In the same directory where you installed Hardhat run:

  ```bash
  npx hardhat
  ```

  - Select `Create a basic sample project`
  - Press enter for the already specified `Hardhat Project root`
  - Press enter for the question on if you want to add a `.gitignore`
  - Press enter for `Do you want to install this sample project's dependencies with npm (@nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers)?`

Now you have a hardhat project ready to go!

If you are not on mac, please do this extra step and install these libraries as well :)

```bash
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

and press `enter` for all the questions.

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

The `greet` method returns the greeting string. Since this is a `view` function, it costs no gas, and requires no signing to execute.
The `setGreeting` method sets the greeting string with a provided user value. Since this updates the smart contract state, it costs gas, and requires signing.
**One intresting thing to note about the `setGreeting` method is that it uses the hardhat's console.log contract, so we can actually debug and see to what value was `greeting` changed to!**

**Isnt this just mind blowing 🤯 🤯 🤯**

Now to actually start running your local blockchain in your terminal pointing to your directory execute this command:

```bash
npx hardhat node
```

(Keep this terminal running)

This command starts a local blockchain node for you.
You should be able to see some accounts which have already been funded by hardhat with 10000 ETH
![](https://i.imgur.com/NkwsCXn.png)

Now lets add this node and this account to MetaMask.

## Metamask Connection

- To use metamask to connect to this network, click on your profile and click on settings
  ![](https://i.imgur.com/rZi6Ofi.png)

- Then click on Networks, followed by `Localhost 8545`
  ![](https://i.imgur.com/X74AcuZ.png)

![](https://i.imgur.com/9SjtWCu.png)

- Change the Chain ID to `31337`(this is the chainId for the local blockchain you are running) and then click `Save`
  ![](https://i.imgur.com/Dt6py3h.png)

- Awesome now your MetaMask has a connection to your local blockchain, we should now add the accounts that hardhat gave to us
- In the node terminal, you should see several accounts displayed. Let's grab one of those:

  ```Shell
  Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
  Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
  ```

Go to metamask --> click on your profile --> import account. Select private key in the dropdown and paste the private key from the account you wish.You should now see an account with 10000 ETH

## Remix

We will now deploy our contract to local blockchain and interact with it using Remix

Go to [remix.ethereum.org](<[remix.ethereum.org](https://remix.ethereum.org/#optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.7+commit.e28d00a7.js)>) and a new file inside the contracts folder named `Greeter.sol`

- Copy this code into it:

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

This is the same code, we explained above

- Compile `Greeter.sol`
  ![](https://i.imgur.com/bhAwIRf.png)

- Now to deploy, go to deployment tab and in your environment select `Injected Web3`, make sure that the account connected is the one that you imported above and the network is `Localhost 8545` on your MetaMask
  ![](https://i.imgur.com/zgGKlQm.png)
  ![](https://i.imgur.com/qrJTtLi.png)

- Set a greeting and click on deploy

- Now you have deployed the contract

- Set a greeting and click on `setGreeting`
  ![](https://i.imgur.com/Rkc6tOH.png)

- Now check your terminal which was running your hardhat node, it should have the console.log

![](https://i.imgur.com/zgD7fo7.png)

Lets gooo!!! You learnt how to do print statements in a contract 🚀 🚀 🚀

---

## Contributors

**This module was built in collaboration with [Hypotenuse Labs](https://hypotenuse.ca/)**

![](https://i.imgur.com/Ewwk3Iz.png)
