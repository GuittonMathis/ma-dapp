// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

/// @title Contrat Artwork
/// @dev Ce contrat permet la création, l'achat et la gestion des œuvres d'art sous forme de NFT
contract Artwork is ERC721Enumerable {

    /// @notice Struct pour une œuvre d'art
    /// @param title Le titre de l'œuvre
    /// @param description La description de l'œuvre
    /// @param imageUrl L'URL de l'image de l'œuvre
    /// @param price Le prix de l'œuvre
    /// @param isSold Booléen indiquant si l'œuvre a été vendue ou non
    /// @param date La date de création de l'œuvre
    /// @param dimensions Les dimensions de l'œuvre
    struct ArtworkDetails {
        string title;
        string description;
        string imageUrl;
        uint256 price;
        bool isSold;
        uint256 date;
        string dimensions;
    }

    /// @notice Un tableau contenant toutes les œuvres d'art
    ArtworkDetails[] public artworks;

    /// @notice Le constructeur du contrat
    constructor() ERC721("Artwork", "ART") {}

    /// @notice Crée une nouvelle œuvre d'art
    /// @param _title Le titre de l'œuvre
    /// @param _description La description de l'œuvre
    /// @param _imageUrl L'URL de l'image de l'œuvre
    /// @param _price Le prix de l'œuvre
    /// @param _date La date de création de l'œuvre
    /// @param _dimensions Les dimensions de l'œuvre
    function createArtwork(string memory _title, string memory _description, string memory _imageUrl, uint256 _price, uint256 _date, string memory _dimensions) public {
        ArtworkDetails memory newArtwork = ArtworkDetails({
            title: _title,
            description: _description,
            imageUrl: _imageUrl,
            price: _price,
            isSold: false,
            date: _date,
            dimensions: _dimensions
        });

        artworks.push(newArtwork);
        uint artworkId = artworks.length - 1;

        // Mint un nouveau token pour le créateur de l'œuvre
        _mint(msg.sender, artworkId);
    }

    /// @notice Achète une œuvre d'art
    /// @param artworkId L'identifiant de l'œuvre à acheter
    function buyArtwork(uint artworkId) public payable {
        ArtworkDetails memory artwork = artworks[artworkId];

        // Vérifie que le montant envoyé est correct et que l'œuvre n'a pas déjà été vendue
        require(msg.value == artwork.price, "The amount sent is not correct.");
        require(!artwork.isSold, "The artwork is already sold.");

        // Transfert l'ownership du token correspondant à l'œuvre
        _transfer(ownerOf(artworkId), msg.sender, artworkId);

        artwork.isSold = true;
        artworks[artworkId] = artwork;
    }
}
