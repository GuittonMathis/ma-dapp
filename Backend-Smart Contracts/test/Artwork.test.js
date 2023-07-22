const Artwork = artifacts.require("Artwork");

// Suite de tests pour le contrat Artwork
contract("Artwork", function(accounts) {
  let artwork;

  // Initialisation avant chaque test
  beforeEach(async function() {
    // Déploie un nouveau contrat Artwork
    artwork = await Artwork.new();
  });

  // Test pour vérifier la création d'une nouvelle oeuvre d'art
  it("Should create a new artwork", async function() {
    // Création d'une oeuvre d'art
    await artwork.createArtwork("Title", "Description", "ImageUrl", 100, Date.now(), "Dimensions", { from: accounts[0] });

    // Récupération des détails de l'oeuvre d'art créée
    const artworkDetails = await artwork.artworks(0);

    // Vérification que les détails de l'oeuvre correspondent aux données enregistrées
    assert.equal(artworkDetails.title, "Title");
    assert.equal(artworkDetails.description, "Description");
    assert.equal(artworkDetails.imageUrl, "ImageUrl");
    assert.equal(artworkDetails.price.toNumber(), 100);
    assert.equal(artworkDetails.isSold, false);
    assert.equal(artworkDetails.dimensions, "Dimensions");
  });

  // Test pour vérifier l'achat d'une oeuvre d'art
  it("Should buy an artwork", async function() {
    // Création d'une oeuvre d'art
    await artwork.createArtwork("Title", "Description", "ImageUrl", 100, Date.now(), "Dimensions", { from: accounts[0] });

    // Achat de l'oeuvre d'art
    await artwork.buyArtwork(0, { from: accounts[1], value: 100 });

    // Récupération des détails de l'oeuvre d'art
    const artworkDetails = await artwork.artworks(0);

    // Vérification que l'oeuvre d'art a été marquée comme vendue
    assert.equal(artworkDetails.isSold, true);
  });

  // Test pour vérifier qu'il n'est pas possible d'acheter une oeuvre d'art déjà vendue
  it("Should not allow to buy an artwork which is already sold", async function() {
    // Création d'une oeuvre d'art
    await artwork.createArtwork("Title", "Description", "ImageUrl", 100, Date.now(), "Dimensions", { from: accounts[0] });

    // Achat de l'oeuvre d'art
    await artwork.buyArtwork(0, { from: accounts[1], value: 100 });

    try {
      // Tentative d'achat de l'oeuvre d'art déjà vendue
      await artwork.buyArtwork(0, { from: accounts[1], value: 100 });
      assert.fail("Expected revert not received");
    } catch (error) {
      // Vérification que l'erreur est celle attendue
      assert(error.message.includes("The artwork is already sold."), "Expected 'The artwork is already sold.' but got something else");
    }
  });

  // Test pour vérifier qu'il n'est pas possible d'acheter une oeuvre d'art avec un montant incorrect
  it("Should not allow to buy an artwork with an incorrect amount", async function() {
    // Création d'une oeuvre d'art
    await artwork.createArtwork("Title", "Description", "ImageUrl", 100, Date.now(), "Dimensions", { from: accounts[0] });

    try {
      // Tentative d'achat de l'oeuvre d'art avec un montant incorrect
      await artwork.buyArtwork(0, { from: accounts[1], value: 50 });
      assert.fail("Expected revert not received");
    } catch (error) {
      // Vérification que l'erreur est celle attendue
      assert(error.message.includes("The amount sent is not correct."), "Expected 'The amount sent is not correct.' but got something else");
    }
  });

  // Test pour vérifier qu'il n'est pas possible d'acheter une oeuvre d'art inexistante
  it("Should not allow to buy a non-existent artwork", async function() {
    try {
      // Tentative d'achat d'une oeuvre d'art inexistante
      await artwork.buyArtwork(1, { from: accounts[1], value: 100 });
      assert.fail("Expected revert not received");
    } catch (error) {
      // Vérification que l'erreur est celle attendue
      assert(error.message.includes("revert"), "Expected 'revert' but got something else");
    }
  });

  // Test pour vérifier qu'il n'est pas possible d'acheter une oeuvre d'art que l'on possède déjà
it("Should not allow to buy an artwork that is already owned", async function() {
  // Création d'une oeuvre d'art
  await artwork.createArtwork("Title", "Description", "ImageUrl", 100, Date.now(), "Dimensions", { from: accounts[0] });

  // Achat de l'oeuvre d'art
  await artwork.buyArtwork(0, { from: accounts[0], value: 100 });

  // Tentative d'achat de l'oeuvre d'art déjà possédée
  try {
    await artwork.buyArtwork(0, { from: accounts[0], value: 100 });
  } catch (err) {
    // Vérifie que l'erreur est bien un 'revert', ce qui indique que l'opération a été refusée
    assert(err.message.indexOf('revert') >= 0, "Expected revert error, but got: " + err.message);
  }
});

it("Should not allow to create an artwork with missing details", async function() {
  try {
    // Tente de créer une œuvre d'art avec des détails manquants
    await artwork.createArtwork("", "Description", "ImageUrl", 100, Date.now(), "Dimensions", { from: accounts[0] });
  } catch (err) {
    // Vérifie que l'erreur est bien un 'revert', ce qui indique que l'opération a été refusée
    assert(err.message.indexOf('revert') >= 0, "Expected revert error, but got: " + err.message);
  }

  try {
    // Tente de créer une œuvre d'art avec un prix nul
    await artwork.createArtwork("Title", "Description", "ImageUrl", 0, Date.now(), "Dimensions", { from: accounts[0] });
  } catch (err) {
    // Vérifie que l'erreur est bien un 'revert', ce qui indique que l'opération a été refusée
    assert(err.message.indexOf('revert') >= 0, "Expected revert error, but got: " + err.message);
  }
});



});
