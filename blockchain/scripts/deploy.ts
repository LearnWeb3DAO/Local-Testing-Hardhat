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