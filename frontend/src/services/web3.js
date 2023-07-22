import Web3 from 'web3';
import config from '../config/.env';

export class Web3Service {
  web3 = null;

  async getInstance() {
    if (!this.web3) {
      if (window.ethereum) {
        this.web3 = new Web3(window.ethereum);
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
          // User denied account access
          console.error("User denied account access");
        }
      } else if (window.web3) {
        this.web3 = new Web3(window.web3.currentProvider);
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    }

    return this.web3; // Returning the instance of web3
  }

  getWeb3() {
    return this.web3;
  }

  getMnemonic() {
    return config.MNEMONIC;
  }

  getInfuraId() {
    return config.INFURA_ID;
  }
}
