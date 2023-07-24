import Web3Service from './web3';
import ArtistContract from '../contracts/Artist.json';

const NETWORK_ID = '11155111'; 

let Artist;

async function init() {
  const web3Service = await Web3Service.getInstance();
  const web3 = web3Service.getWeb3(); 
  console.log('Web3 instance: ', web3);
  console.log('Web3.eth object:', web3.eth);

  if (web3 && web3.eth) {
    Artist = new web3.eth.Contract(
      ArtistContract.abi,
      ArtistContract.networks[NETWORK_ID].address
    );
  } else {
    console.error('Web3 or web3.eth is undefined');
  }
}

async function getArtist(address) {
  await init();
  const artistProfile = await Artist.methods.getArtistProfile(address).call();
  const name = artistProfile[0];
  const bio = artistProfile[1];

  return { name, bio };
}

const ArtistService = {
  getArtist,
};
export default ArtistService;
