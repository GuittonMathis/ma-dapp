import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Web3Service } from '../services/web3';
import Artist from '../contracts/Artist.json';
import '../styles/ArtistProfilePage.css';

function ArtistProfilePage() {
    const [artist, setArtist] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        async function fetchData() {
            try {
                const web3Service = new Web3Service();
                const web3 = await web3Service.getInstance();
                const artistInstance = new web3.eth.Contract(
                    Artist.abi,
                    '0x796276f3A87B2E01f351040fc24415dAb854AD29'
                );
                const fetchedArtist = await artistInstance.methods.getArtistProfile(id).call();

                setArtist(fetchedArtist);
            } catch (error) {
                console.error("Error fetching artist details:", error);
            }
        }

        fetchData();
    }, [id]);

    if (artist === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{artist.name}</h1>
            <p>{artist.bio}</p>
        </div>
    );
}

export default ArtistProfilePage;
