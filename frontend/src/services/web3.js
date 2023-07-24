import Web3 from 'web3';

export class Web3Service {
  web3 = null;

  async getInstance() {
    if (!this.web3) {
      if (window.ethereum) {
        this.web3 = new Web3(window.ethereum);
        try {
         
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
         
          console.error("User denied account access");
        }
      } else if (window.web3) {
        this.web3 = new Web3(window.web3.currentProvider);
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    }

    return this.web3; 
  }

  getWeb3() {
    return this.web3;
  }

  getMnemonic() {
    return process.env.REACT_APP_MNEMONIC;
  }

  getInfuraId() {
    return process.env.REACT_APP_INFURA_ID;
  }
}
