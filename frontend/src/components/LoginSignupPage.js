import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { Web3Service } from '../services/web3';
import Artist from '../contracts/Artist.json';
import '../styles/LoginSignupPage.css';

function LoginSignupPage() {
  const [account, setAccount] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationality, setNationality] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', function (accounts) {
        localStorage.setItem('account', accounts[0]);
        setAccount(accounts[0]);
      });
    }
  }, []);

  async function handleSignup() {
    try {
      const web3Service = new Web3Service();
      const web3 = await web3Service.getInstance();
      const accounts = await web3.eth.getAccounts();

      if (accounts.length > 0) {
        const artistInstance = new web3.eth.Contract(
          Artist.abi,
          '0x796276f3A87B2E01f351040fc24415dAb854AD29'
        );

        console.log('Form values:', firstName, lastName, nationality, age);

        await artistInstance.methods.createArtistProfile(firstName, lastName, nationality, age).send({ from: accounts[0] });

        localStorage.setItem('account', accounts[0]);
        setAccount(accounts[0]);

        setFirstName('');
        setLastName('');
        setNationality('');
        setAge('');
      } else {
        console.log('No accounts found');
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <h1 className="text-center">Signup</h1>
          <Form>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" placeholder="Enter First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formNationality">
              <Form.Label>Nationality</Form.Label>
              <Form.Control type="text" placeholder="Enter Nationality" value={nationality} onChange={e => setNationality(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formAge">
              <Form.Label>Age</Form.Label>
              <Form.Control type="number" placeholder="Enter Age" value={age} onChange={e => setAge(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="button" onClick={handleSignup} className="button mt-3">
              Sign up with MetaMask
            </Button>

            {account && <p className="logged-in">Logged in with account: {account}</p>}

          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginSignupPage;
