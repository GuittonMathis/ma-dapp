import { Web3Service } from './web3';
import MarketplaceContract from '../contracts/Marketplace.json';
import ArtworkContract from '../contracts/Artwork.json'; 

let Marketplace;
let Artwork;

async function init() {
  const web3Service = new Web3Service();
  const web3 = await web3Service.getInstance();
  Marketplace = new web3.eth.Contract(
    MarketplaceContract.abi,
    '0x2eB2fb7ec62c9f02a803dD404384FDe0A7022d7B'
  );
  Artwork = new web3.eth.Contract(
    ArtworkContract.abi,
    '0xBF66a6DA5Ee080c2009B82F807804A694cC728aD'  
  );
}

async function getItemsForSale() {
  if (!Marketplace || !Artwork) {
    await init();
  }
  const items = await Marketplace.methods.fetchMarketItems().call();

  const convertedItems = await Promise.all(items.map(async item => {
    
    const artwork = await Artwork.methods.artworks(item.tokenId).call();
    
   
    const web3Service = new Web3Service();
    const web3 = await web3Service.getInstance(); 
    const convertedPrice = web3.utils.fromWei(item.price, 'ether');

   
    const dimensions = artwork.dimensions;
    const date = artwork.date;

    return { ...item, price: convertedPrice, imageUrl: artwork.imageUrl, dimensions, date };
  }));

  return convertedItems;
}

async function getMarketplaceInstance() {
  if (!Marketplace) {
    await init();
  }
  return Marketplace;
}

async function buyArtwork(id, price) {
  const web3Service = new Web3Service();
  const web3 = await web3Service.getInstance();
  const accounts = await web3.eth.getAccounts();
  if (accounts.length === 0) {
    throw new Error('No accounts found. Please connect your Ethereum account.');
  }

  const priceInWei = web3.utils.toWei(String(price), 'ether');
  await Marketplace.methods.buyNFT(id).send({ from: accounts[0], value: priceInWei });
}

const services = {
  init,
  getItemsForSale,
  getMarketplaceInstance,
  buyArtwork
};

export default services;
