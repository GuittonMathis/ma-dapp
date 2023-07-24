import React, { useState } from 'react';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { Web3Service } from '../services/web3';
import ArtworkService from '../services/artwork';

function CreateArtworkPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [dimensions, setDimensions] = useState('');

  async function handleCreate() {
    try {
      const web3Service = new Web3Service();
      const web3 = await web3Service.getInstance();
      const accounts = await web3.eth.getAccounts();
  
      if (accounts.length > 0) {
        const artworkInstance = await ArtworkService.getArtworkInstance();
        await artworkInstance.methods.createArtwork(title, description, imageUrl, web3.utils.toWei(price, 'ether'), date, dimensions).send({ from: accounts[0] });
      } else {
        console.log('No accounts found');
      }
    } catch (error) {
      console.error('Error creating artwork:', error);
    }
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <h1 className="text-center">Create Artwork</h1>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter Title" value={title} onChange={e => setTitle(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" placeholder="Enter Description" value={description} onChange={e => setDescription(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formImageUrl">
              <Form.Label>Image URL</Form.Label>
              <Form.Control type="text" placeholder="Enter Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formPrice">
              <Form.Label>Price (in Ether)</Form.Label>
              <Form.Control type="number" placeholder="Enter Price" value={price} onChange={e => setPrice(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formDate">
              <Form.Label>Date (UNIX timestamp)</Form.Label>
              <Form.Control type="number" placeholder="Enter Date" value={date} onChange={e => setDate(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formDimensions">
              <Form.Label>Dimensions</Form.Label>
              <Form.Control type="text" placeholder="Enter Dimensions" value={dimensions} onChange={e => setDimensions(e.target.value)} />
            </Form.Group>
            
            <Button variant="primary" type="button" onClick={handleCreate}>
              Create Artwork
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateArtworkPage;
