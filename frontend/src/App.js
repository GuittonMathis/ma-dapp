import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import ArtworkDetailPage from './components/ArtworkDetailPage';
import ArtistProfilePage from './components/ArtistProfilePage';
import LoginSignupPage from './components/LoginSignupPage';
import CreateArtworkPage from './components/CreateArtworkPage';
import SellArtworkPage from './components/SellArtworkPage';
import ArtworkForSalePage from './components/ArtworkForSalePage'; // Make sure to import the new page
import './styles/App.css';

function App() {
  const [account, setAccount] = useState('');

  useEffect(() => {
    async function fetchAccount() {
      if (typeof window.ethereum !== 'undefined') { // Check if MetaMask is installed
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } else {
        console.error("Please install MetaMask.");
      }
    }S
    fetchAccount();
  }, []);

  return (
    <Router>
      <header>
        {/* Display the address of the connected account in the header */}
        <p>Connected as: {account}</p>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/item/:id" element={<ArtworkDetailPage />} />
        <Route path="/artist/:id" element={<ArtistProfilePage />} />
        <Route path="/login" element={<LoginSignupPage />} />
        <Route path="/create-artwork" element={<CreateArtworkPage />} />
        <Route path="/sell-artwork" element={<SellArtworkPage />} />
        <Route path="/artworks-for-sale" element={<ArtworkForSalePage />} /> {/* Add the new route here */}
      </Routes>
    </Router>
  );
}

export default App;
