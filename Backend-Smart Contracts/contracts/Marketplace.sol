// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title Contrat Marketplace
/// @dev Ce contrat gère les ventes et achats d'oeuvres d'art sur le marché
contract Marketplace is ReentrancyGuard {
    /// @notice Définition de la structure d'un article à vendre
    /// @dev Un article est une œuvre d'art représentée par un token ERC721
    struct Item {
        uint itemId;                   // Identifiant unique de l'article
        address nftContract;           // Adresse du contrat ERC721
        uint256 tokenId;               // Identifiant du token représentant l'œuvre d'art
        address payable seller;        // Adresse du vendeur
        address payable owner;         // Adresse du propriétaire
        uint256 price;                 // Prix de l'article
        bool sold;                     // Statut de l'article (vendu ou non)
        string name;                   // Nom de l'article
        string description;            // Description de l'article
    }

    // Liste des articles
    Item[] public items;
    // Compteur pour l'ID de l'article
    uint public itemId;

    /// @notice Liste un NFT à vendre sur le marché
    /// @param nftContract Adresse du contrat ERC721
    /// @param tokenId Identifiant du token
    /// @param price Prix du token
    /// @param name Nom de l'oeuvre
    /// @param description Description de l'oeuvre
    function listNFT(address nftContract, uint256 tokenId, uint256 price, string memory name, string memory description) public {
        // Création d'un nouvel article
        Item memory newItem = Item({
            itemId: itemId,
            nftContract: nftContract,
            tokenId: tokenId,
            seller: payable(msg.sender),
            owner: payable(address(0)),
            price: price,
            sold: false,
            name: name,
            description: description
        });

        // Ajout de l'article à la liste des articles
        items.push(newItem);
        itemId++;

        // Transfert du token de l'expéditeur vers le contrat
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    }

    /// @notice Achète un NFT sur le marché
    /// @param _itemId Identifiant de l'article à acheter
    function buyNFT(uint _itemId) public payable nonReentrant {
    // Vérifie que l'élément existe
    require(_itemId < items.length, "Item does not exist");

    // Récupère les détails de l'article
    Item storage item = items[_itemId];

    // Vérifie que l'article n'a pas déjà été vendu
    require(!item.sold, "The item has already been sold");

    // Récupère le prix et vérifie que le montant envoyé correspond au prix de l'article
    uint price = item.price;
    require(msg.value == price, "Please submit the asking price in order to complete the purchase");

    // Met à jour le propriétaire et le statut de l'article
    item.owner = payable(msg.sender);
    item.sold = true;

    // Transfère le montant à l'ancien propriétaire de l'article
    item.seller.transfer(msg.value);

    // Transfère le token de l'article au nouvel acheteur
    IERC721(item.nftContract).transferFrom(address(this), msg.sender, item.tokenId);
}


    /// @notice Récupère la liste des articles sur le marché
    /// @return Un tableau contenant tous les articles
    function fetchMarketItems() public view returns (Item[] memory) {
        return items;
    }
}
