import abi from './abi/PPPContract.json'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Contractor from './components/Contractor'
import User from './components/User'
import Regulator from './components/Regulator'
import Government from './components/Government'
import './App.css'

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  })
  const [account, setAccount] = useState('None')
  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = '0x9cF6Fd562FDbae79d7583908cA04b36476f4C4D4'
      const contractABI = abi.abi
      try {
        const { ethereum } = window

        if (ethereum) {
          const account = await ethereum.request({
            method: 'eth_requestAccounts',
          })

          window.ethereum.on('chainChanged', () => {
            window.location.reload()
          })

          window.ethereum.on('accountsChanged', () => {
            window.location.reload()
          })

          const provider = new ethers.providers.Web3Provider(ethereum)
          const signer = provider.getSigner()
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          )
          setAccount(account)
          setState({ provider, signer, contract })
        } else {
          alert('Please install metamask')
        }
      } catch (error) {
        console.log(error)
      }
    }
    connectWallet()
  }, [])
  // console.log(state);
  return (
    <div style={{ backgroundColor: '#EFEFEF', height: '100%' }}>
      <p
        class='text-muted lead '
        style={{ marginTop: '10px', marginLeft: '5px' }}
      >
        <small>Connected Account - {account}</small>
      </p>
      <div className='container'>
        <Government state={state} />
        <Contractor state={state} />
        <User state={state} />
        <Regulator state={state} />
      </div>
    </div>
  )
}

export default App
