// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Contrat Artist
/// @dev Ce contrat permet la création et la gestion de profils d'artistes
contract Artist {
    /// @notice Struct pour un profil d'artiste
    /// @param firstName Prénom de l'artiste
    /// @param lastName Nom de famille de l'artiste
    /// @param nationality Nationalité de l'artiste
    /// @param age Âge de l'artiste
    struct ArtistProfile {
        string firstName;
        string lastName;
        string nationality;
        uint age;
    }

    /// @notice Un mapping reliant une adresse Ethereum à un profil d'artiste
    mapping(address => ArtistProfile) public artists;

    /// @notice Crée un nouveau profil d'artiste
    /// @param _firstName Le prénom de l'artiste
    /// @param _lastName Le nom de famille de l'artiste
    /// @param _nationality La nationalité de l'artiste
    /// @param _age L'âge de l'artiste
    function createArtistProfile(string memory _firstName, string memory _lastName, string memory _nationality, uint _age) public {
        ArtistProfile memory newArtist = ArtistProfile({
            firstName: _firstName,
            lastName: _lastName,
            nationality: _nationality,
            age: _age
        });
        
        artists[msg.sender] = newArtist;
    }

    /// @notice Met à jour un profil d'artiste
    /// @param _firstName Le nouveau prénom de l'artiste
    /// @param _lastName Le nouveau nom de famille de l'artiste
    /// @param _nationality La nouvelle nationalité de l'artiste
    /// @param _age Le nouvel âge de l'artiste
    function updateArtistProfile(string memory _firstName, string memory _lastName, string memory _nationality, uint _age) public {
        ArtistProfile storage artist = artists[msg.sender];
        artist.firstName = _firstName;
        artist.lastName = _lastName;
        artist.nationality = _nationality;
        artist.age = _age;
    }

    /// @notice Récupère le profil d'un artiste
    /// @param _artistAddress L'adresse de l'artiste dont on veut récupérer le profil
    /// @return firstName Le prénom de l'artiste
    /// @return lastName Le nom de famille de l'artiste
    /// @return nationality La nationalité de l'artiste
    /// @return age L'âge de l'artiste
    function getArtistProfile(address _artistAddress) public view returns (string memory, string memory, string memory, uint) {
        ArtistProfile memory artist = artists[_artistAddress];
        return (artist.firstName, artist.lastName, artist.nationality, artist.age);
    }
}
