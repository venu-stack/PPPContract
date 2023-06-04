require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
require('@nomiclabs/hardhat-ethers')
require('hardhat-abi-exporter')

module.exports = {
  solidity: '0.8.18',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/JHE51U_CXxmZ9LYInV1qKd-Etp1-fv83',
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
  abiExporter: {
    path: './abi',
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
  },
}
