const HDWalletProvider = require('@truffle/hdwallet-provider'); 
require('dotenv').config();

module.exports = {
  
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
   
   

    
    sepolia:{
    provider: function(){ 
      return new HDWalletProvider(
        `${process.env.MNEMONIC}`, 
        `https://sepolia.infura.io/v3/${process.env.INFURA_ID}`
      )
    },
    network_id: "11155111", 
   }
  },

  goerli: {
    provider: function() { 
      return new HDWalletProvider(
        `${process.env.MNEMONIC}`, 
        `https://goerli.infura.io/v3/${process.env.INFURA_ID}`
      )
    },
    network_id: "5", // ID de réseau pour Goerli, sous forme de chaîne
    gas: 4465030,
    gasPrice: 10000000000,
  },





  mocha: {
  },


  compilers: {
    solc: {
      version: "0.8.20",      // Fetch exact version from solc-bin (default: truffle's version)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: false,
         runs: 200
       },
      }
    }
  },
};
