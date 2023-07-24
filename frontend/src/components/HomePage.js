import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; 

function HomePage() {
  return (
    <Container className="container">
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <h1 className="text-center">Bienvenue sur ArtTRUST</h1>
          <p>Naviguez à travers notre galerie d'art numérique décentralisée et découvrez des œuvres d'art uniques.</p>

          <div className="d-flex justify-content-around mt-5">
            <Button as={Link} to="/create-artwork" variant="primary" className="button">Créer une œuvre</Button>
            <Button as={Link} to="/sell-artwork" variant="success" className="button">Vendre une œuvre</Button>
            <Button as={Link} to="/artworks-for-sale" variant="info" className="button">Voir les œuvres à vendre</Button>
            <Button as={Link} to="/login" variant="dark" className="button button-dark">Se connecter</Button>

          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
