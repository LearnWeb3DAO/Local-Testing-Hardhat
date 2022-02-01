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
 