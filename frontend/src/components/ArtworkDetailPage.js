import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';
import Artwork from '../contracts/Artwork.json';
import { useNavigate } from 'react-router-dom';
import marketplace from '../services/marketplace'; 

function ArtworkDetailPage() {
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true); 
      try {
        const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Artwork.networks[networkId];

        if (!deployedNetwork) {
          console.error('Artwork contract has not been deployed to the current network');
          return;
        }

        const artworkInstance = new web3.eth.Contract(
          Artwork.abi,
          '0xBF66a6DA5Ee080c2009B82F807804A694cC728aD'
        );
        const fetchedItem = await artworkInstance.methods.artworks(id).call();
        setItem(fetchedItem);
        setIsLoading(false); 
      } catch (error) {
        console.error("Error fetching artwork details:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]);

  async function handleBuy() {
    try {
      await marketplace.buyArtwork(id); 
      alert('Purchase successful!');
    } catch (error) {
      console.error('An error occurred while purchasing the artwork.', error);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (!item) {
    return <div>No artwork found</div>; 
  }

  return (
    <div>
      <h1>{item.title}</h1>
      <p>{item.description}</p>
      <p>Price: {Web3.utils.fromWei(item.price, 'ether')} ETH</p>
      <img src={item.imageUrl} alt={item.title} />
      <button onClick={handleBuy}>Buy</button>
      <button onClick={() => navigate('/login')}>Go to Login Page</button>
    </div>
  );
}
export default ArtworkDetailPage;
