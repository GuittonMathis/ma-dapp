import React, { useState } from 'react';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { Web3Service } from '../services/web3';
import ArtworkService from '../services/artwork';
import MarketplaceService from '../services/marketplace';

const MarketplaceContractAddress = '0x2eB2fb7ec62c9f02a803dD404384FDe0A7022d7B';
const ERC721ContractAddress = '0xBF66a6DA5Ee080c2009B82F807804A694cC728aD';

function SellArtworkPage() {
  const [artworkId, setArtworkId] = useState('');
  const [price, setPrice] = useState('');
  const [artworkTitle, setArtworkTitle] = useState('');
  const [artworkDescription, setArtworkDescription] = useState('');

  async function handleSell() {
    try {
      const web3Service = new Web3Service();
      const web3 = await web3Service.getInstance();
      const accounts = await web3.eth.getAccounts();

      const owner = await ArtworkService.getOwnerOf(artworkId);

      if (accounts.length > 0 && accounts[0] === owner) {
        const approvedAddress = await ArtworkService.getApproved(artworkId);

        if (approvedAddress !== MarketplaceContractAddress) {
          await ArtworkService.approve(MarketplaceContractAddress, artworkId);
        }

        const marketplaceInstance = await MarketplaceService.getMarketplaceInstance();
        const priceInWei = web3.utils.toWei(price, 'ether'); 
        await marketplaceInstance.methods.listNFT(ERC721ContractAddress, artworkId, priceInWei, artworkTitle, artworkDescription).send({ from: accounts[0] });
      } else {
        console.log('You are not the owner of this artwork');
      }
    } catch (error) {
      console.error('Error selling artwork:', error);
    }
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <h1 className="text-center">Sell Artwork</h1>
          <Form>
            <Form.Group controlId="formArtworkId">
              <Form.Label>Artwork ID</Form.Label>
              <Form.Control type="number" placeholder="Enter Artwork ID" value={artworkId} onChange={e => setArtworkId(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formPrice">
              <Form.Label>Price (in Ether)</Form.Label>
              <Form.Control type="number" placeholder="Enter Price" value={price} onChange={e => setPrice(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formTitle">
              <Form.Label>Artwork Title</Form.Label>
              <Form.Control type="text" placeholder="Enter Title" value={artworkTitle} onChange={e => setArtworkTitle(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Artwork Description</Form.Label>
              <Form.Control type="text" placeholder="Enter Description" value={artworkDescription} onChange={e => setArtworkDescription(e.target.value)} />
            </Form.Group>

            <Button variant="primary" type="button" onClick={handleSell}>
              Sell Artwork
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SellArtworkPage;
