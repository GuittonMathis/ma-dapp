import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarketplaceService from '../services/marketplace';
import '../styles/ArtworkForSalePage.css';  

function ArtworkForSalePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const marketplaceItems = await MarketplaceService.getItemsForSale();
      setItems(marketplaceItems);
    }

    fetchData();
  }, []);

  async function handleBuy(id, price) {
    try {
      await MarketplaceService.buyArtwork(id, price);
      alert('Purchase successful!');
      
      const marketplaceItems = await MarketplaceService.getItemsForSale();
      setItems(marketplaceItems);
    } catch (error) {
      console.error('An error occurred while purchasing the artwork.', error);
    }
  }

  return (
    <div className="artworks-for-sale">
      <h1 className="header">Artworks For Sale</h1>
      <div className="artwork-grid">
        {items.map(item => (
          <div key={item.itemId} className="artwork-card">
            <div className="artwork-image-container">
              <img className="artwork-image" src={item.imageUrl} alt={item.name} />
            </div>
            <div className="artwork-details">
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <p>Price: {item.price} ETH</p>
              {item.sold ? (
                <button disabled>Sold</button>
              ) : (
                <>
                  <button onClick={() => handleBuy(item.itemId, item.price)}>Buy</button>
                  <Link to={`/item/${item.itemId}`}>More details</Link>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArtworkForSalePage;
