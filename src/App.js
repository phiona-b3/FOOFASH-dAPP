import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/layout/navbar/Navbar'
import Footer from './components/layout/footer/Footer'
import Home from './components/home-container/home/Home'
import FoofashDetails from './components/home-container/foofash-details/FoofashDetails'
import CreateFoofash from './components/create-post/CreateFoofash'
import Web3 from 'web3'
import MyFoofash from './abis/Foofash.json'
import { useState } from 'react'

function App() {
  // Add variables
  const [account, setAccount] = useState('')
  const [contractData, setContractData] = useState('')

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying Metamask!',
      )
    }
  }

  const getContract = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
    const networkId = await web3.eth.net.getId()
    const networkData = MyFoofash.networks[networkId]
  
    if (networkData) {
      const abi = MyFoofash.abi
      const address = MyFoofash.networks[networkId].address
      const myContract = new web3.eth.Contract(abi, address)
      setContractData(myContract)
    } else {
      window.alert(
        'Contract is not deployed to the detected network. Connect to the correct network!',
      )
    }
  }

  const connectWallet = async () => {
    await loadWeb3()
    await getContract()
  }

  return (
    <Router>
      <div className="cl">
        <Navbar />
        <Route exact path="/" component={Home} />
        <Switch>
          <Route exact path="/create-foofash" component={CreateFoofash} />
          <Route path="/foofash-details/:foofashId">
            <FoofashDetails />
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  )
}

export default App
