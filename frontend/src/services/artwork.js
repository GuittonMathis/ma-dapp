import { Web3Service } from './web3';
import ArtworkContract from '../contracts/Artwork.json';

class ArtworkService {
  ArtworkInstance = null;

  async getArtworkInstance() {
    if (!this.ArtworkInstance) {
      const web3Service = new Web3Service();
      const web3 = await web3Service.getInstance();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ArtworkContract.networks[networkId];

      if (!deployedNetwork) {
        throw new Error('Contract not deployed on the current network');
      }

      this.ArtworkInstance = new web3.eth.Contract(
        ArtworkContract.abi,
        deployedNetwork.address
      );
    }

    return this.ArtworkInstance;
  }

  async getArtworkDetails(id) {
    const instance = await this.getArtworkInstance();
    const artwork = await instance.methods.artworks(id).call();
    return artwork;
  }

  async getOwnerOf(tokenId) {
    const instance = await this.getArtworkInstance();
    const owner = await instance.methods.ownerOf(tokenId).call();
    return owner;
  }

  async getApproved(tokenId) {
    const instance = await this.getArtworkInstance();
    const approvedAddress = await instance.methods.getApproved(tokenId).call();
    return approvedAddress;
  }

  async approve(addressToApprove, tokenId) {
    const web3Service = new Web3Service();
    const web3 = await web3Service.getInstance();
    const accounts = await web3.eth.getAccounts();

    if (accounts.length > 0) {
      const instance = await this.getArtworkInstance();
      await instance.methods.approve(addressToApprove, tokenId).send({ from: accounts[0] });
    } else {
      console.log('No accounts found');
    }
  }
}

const instance = new ArtworkService();
export default instance;
