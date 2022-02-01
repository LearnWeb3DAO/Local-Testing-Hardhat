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