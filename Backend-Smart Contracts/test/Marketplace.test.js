// Importations nécessaires
const { expectRevert } = require('@openzeppelin/test-helpers');
const Artist = artifacts.require("Artist");
const Artwork = artifacts.require("Artwork");
const Marketplace = artifacts.require("Marketplace");

// Suite de tests pour le contrat Marketplace
contract("Marketplace", function(accounts) {
  let artist, artwork, marketplace;

  // Initialisation avant chaque test
  beforeEach(async function() {
    // Déploie un nouveau contrat pour chaque entité : Artist, Artwork, Marketplace
    artist = await Artist.new();
    artwork = await Artwork.new();
    marketplace = await Marketplace.new();
  });

  // Test pour vérifier la mise en liste d'un NFT
  it("Should list an NFT", async function() {
    // Création d'un profil d'artiste et d'une oeuvre d'art
    await artist.createArtistProfile("FirstName", "LastName", "Nationality", 40, { from: accounts[0] });
    await artwork.createArtwork("Title", "Description", "imageUrl", web3.utils.toWei("1", "ether"), Date.now(), "Dimensions", { from: accounts[0] });
    
    // Approbation du contrat Marketplace pour gérer l'oeuvre d'art
    await artwork.approve(marketplace.address, 0, { from: accounts[0] });

    // Mise en liste de l'oeuvre d'art sur le Marketplace
    await marketplace.listNFT(artwork.address, 0, web3.utils.toWei("1", "ether"), "Name", "Description", { from: accounts[0] });
    
    // Récupération des détails de l'item
    const item = await marketplace.items(0);
    
    // Vérification que les détails de l'item correspondent aux données enregistrées
    assert.equal(item.itemId.toString(), "0");
    assert.equal(item.nftContract, artwork.address);
    assert.equal(item.tokenId.toString(), "0");
    assert.equal(item.seller, accounts[0]);
    assert.equal(item.owner, "0x0000000000000000000000000000000000000000");
    assert.equal(item.price, web3.utils.toWei("1", "ether"));
    assert.equal(item.sold, false);
    assert.equal(item.name, "Name");
    assert.equal(item.description, "Description");
  });

  // Test pour vérifier l'achat d'un NFT
  it("Should buy an NFT", async function() {
    // Création d'un profil d'artiste et d'une oeuvre d'art
    await artist.createArtistProfile("FirstName", "LastName", "Nationality", 40, { from: accounts[0] });
    await artwork.createArtwork("Title", "Description", "imageUrl", web3.utils.toWei("1", "ether"), Date.now(), "Dimensions", { from: accounts[0] });

    // Approbation du contrat Marketplace pour gérer l'oeuvre d'art
    await artwork.approve(marketplace.address, 0, { from: accounts[0] });

    // Mise en liste de l'oeuvre d'art sur le Marketplace
    await marketplace.listNFT(artwork.address, 0, web3.utils.toWei("1", "ether"), "Name", "Description", { from: accounts[0] });
    
    // Achat de l'oeuvre d'art
    await marketplace.buyNFT(0, { from: accounts[1], value: web3.utils.toWei("1", "ether") });
    
    // Récupération des détails de l'item
    const item = await marketplace.items(0);
    
    // Vérification que l'item a été marqué comme vendu et que le propriétaire est correct
    assert.equal(item.owner, accounts[1]);
    assert.equal(item.sold, true);
  });

  // Test pour vérifier qu'il n'est pas possible d'acheter un item avec un montant incorrect
  it("Should not allow to buy an item with an incorrect amount", async function() {
    // Création d'un profil d'artiste et d'une oeuvre d'art
    await artist.createArtistProfile("FirstName", "LastName", "Nationality", 40, { from: accounts[0] });
    await artwork.createArtwork("Title", "Description", "imageUrl", web3.utils.toWei("1", "ether"), Date.now(), "Dimensions", { from: accounts[0] });

    // Approbation du contrat Marketplace pour gérer l'oeuvre d'art
    await artwork.approve(marketplace.address, 0, { from: accounts[0] });

    // Mise en liste de l'oeuvre d'art sur le Marketplace
    await marketplace.listNFT(artwork.address, 0, web3.utils.toWei("1", "ether"), "Name", "Description", { from: accounts[0] });

    // Teste l'achat avec un montant incorrect, vérifie qu'une erreur est levée
    await expectRevert(
      marketplace.buyNFT(0, { from: accounts[1], value: web3.utils.toWei("0.5", "ether") }),
      "Please submit the asking price in order to complete the purchase"
    );
  });

  // Test pour vérifier qu'il n'est pas possible d'acheter un NFT inexistant
  it("Should not allow to buy a non-existent NFT", async function() {
    // Teste l'achat d'un NFT inexistant, vérifie qu'une erreur est levée
    await expectRevert(
      marketplace.buyNFT(99, { from: accounts[1], value: web3.utils.toWei("1", "ether") }),
      "Item does not exist"
    );
  });

  // Test pour vérifier qu'il n'est pas possible d'acheter un NFT déjà vendu
  it("Should not allow to buy an NFT that is already sold", async function() {
    // Création d'un profil d'artiste et d'une oeuvre d'art
    await artist.createArtistProfile("FirstName", "LastName", "Nationality", 40, { from: accounts[0] });
    await artwork.createArtwork("Title", "Description", "imageUrl", web3.utils.toWei("1", "ether"), Date.now(), "Dimensions", { from: accounts[0] });

    // Approbation du contrat Marketplace pour gérer l'oeuvre d'art
    await artwork.approve(marketplace.address, 0, { from: accounts[0] });

    // Mise en liste de l'oeuvre d'art sur le Marketplace et achat de l'oeuvre
    await marketplace.listNFT(artwork.address, 0, web3.utils.toWei("1", "ether"), "Name", "Description", { from: accounts[0] });
    await marketplace.buyNFT(0, { from: accounts[1], value: web3.utils.toWei("1", "ether") });

    // Teste l'achat d'un NFT déjà vendu, vérifie qu'une erreur est levée
    await expectRevert(
      marketplace.buyNFT(0, { from: accounts[1], value: web3.utils.toWei("1", "ether") }),
      "The item has already been sold"
    );
  });

  // Test pour vérifier la récupération de tous les items
  it("Should fetch all items", async function() {
    // Création d'un profil d'artiste et d'une oeuvre d'art
    await artist.createArtistProfile("FirstName", "LastName", "Nationality", 40, { from: accounts[0] });
    await artwork.createArtwork("Title", "Description", "imageUrl", web3.utils.toWei("1", "ether"), Date.now(), "Dimensions", { from: accounts[0] });
    
    // Approbation du contrat Marketplace pour gérer l'oeuvre d'art
    await artwork.approve(marketplace.address, 0, { from: accounts[0] });

    // Mise en liste de l'oeuvre d'art sur le Marketplace
    await marketplace.listNFT(artwork.address, 0, web3.utils.toWei("1", "ether"), "Name", "Description", { from: accounts[0] });

    // Récupération de tous les items sur le Marketplace
    const items = await marketplace.fetchMarketItems();

    // Vérification qu'un seul item a été listé
    assert.equal(items.length, 1);
    assert.equal(items[0].itemId.toString(), "0");
  });

// Test pour vérifier qu'il n'est pas possible de lister un NFT que l'on ne possède pas
it("Should not allow to list a NFT that is not owned", async function() {
  // Création d'une oeuvre d'art
  await artwork.createArtwork("Title", "Description", "ImageUrl", 100, Date.now(), "Dimensions", { from: accounts[0] });

  // Tentative de mise en liste d'un NFT non possédé
  try {
    await marketplace.listNFT(artwork.address, 0, web3.utils.toWei("1", "ether"), "Name", "Description", { from: accounts[1] });
  } catch (err) {
    // Vérifie que l'erreur est bien un 'revert', ce qui indique que l'opération a été refusée
    assert(err.message.indexOf('revert') >= 0, "Expected revert error, but got: " + err.message);
  }
});

it("Should not allow to list a NFT that is already listed", async function() {
  // Création d'une œuvre d'art
  await artwork.createArtwork("Title", "Description", "ImageUrl", 100, Date.now(), "Dimensions", { from: accounts[0] });

  // Approbation du contrat Marketplace pour gérer l'oeuvre d'art
  await artwork.approve(marketplace.address, 0, { from: accounts[0] });

  // Mise en liste de l'oeuvre d'art sur le Marketplace
  await marketplace.listNFT(artwork.address, 0, web3.utils.toWei("1", "ether"), "Name", "Description", { from: accounts[0] });

  try {
    // Tentative de mise en liste d'un NFT déjà listé
    await marketplace.listNFT(artwork.address, 0, web3.utils.toWei("1", "ether"), "Name", "Description", { from: accounts[0] });
  } catch (err) {
    // Vérifie que l'erreur est bien un 'revert', ce qui indique que l'opération a été refusée
    assert(err.message.indexOf('revert') >= 0, "Expected revert error, but got: " + err.message);
  }
});



});
