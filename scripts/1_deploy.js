const { ethers } = require('hardhat')

async function main() {
  // Deploy MultiSigWallet contract
  const MultiSigWallet = await ethers.getContractFactory('MultiSigWallet')
  const numApprovers = 3 // Number of approvers
  const approvers = []

  // Generate random Ethereum addresses for the approvers
  for (let i = 0; i < numApprovers; i++) {
    const wallet = ethers.Wallet.createRandom()
    approvers.push(wallet.address)
    console.log(approvers)
  }

  const multiSigWallet = await MultiSigWallet.deploy(approvers)
  await multiSigWallet.deployed()
  console.log('MultiSigWallet contract deployed to:', multiSigWallet.address)

  // Deploy PPPContract contract
  const PPPContract = await ethers.getContractFactory('PPPContract')
  const multiSigWalletAddress = multiSigWallet.address
  const pppContract = await PPPContract.deploy(multiSigWalletAddress)
  await pppContract.deployed()
  console.log('PPPContract contract deployed to:', pppContract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
