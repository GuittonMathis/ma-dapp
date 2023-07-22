const Artist = artifacts.require("Artist");

// Suite de tests pour le contrat d'artiste
contract("Artist", function(accounts) {
  let artist;

  // Initialisation avant chaque test
  beforeEach(async function() {
    // Déploie un nouveau contrat d'artiste
    artist = await Artist.new();
  });

  // Test pour vérifier l'enregistrement d'un nouvel artiste
  it("Should register a new artist", async function() {
    // Création d'un profil d'artiste
    await artist.createArtistProfile("FirstName", "LastName", "Nationality", 40, { from: accounts[0] });

    // Récupération du profil d'artiste créé
    const artistProfile = await artist.artists(accounts[0]);

    // Vérification que les détails du profil correspondent aux données enregistrées
    assert.equal(artistProfile.firstName, "FirstName");
    assert.equal(artistProfile.lastName, "LastName");
    assert.equal(artistProfile.nationality, "Nationality");
    assert.equal(artistProfile.age.toNumber(), 40);
  });

  // Test pour vérifier la mise à jour des détails d'un artiste
  it("Should update artist details", async function() {
    // Création d'un profil d'artiste
    await artist.createArtistProfile("FirstName", "LastName", "Nationality", 40, { from: accounts[0] });

    // Mise à jour du profil de l'artiste
    await artist.updateArtistProfile("UpdatedFirstName", "UpdatedLastName", "UpdatedNationality", 50, { from: accounts[0] });

    // Récupération du profil d'artiste mis à jour
    const artistProfile = await artist.artists(accounts[0]);

    // Vérification que les détails du profil ont été mis à jour correctement
    assert.equal(artistProfile.firstName, "UpdatedFirstName");
    assert.equal(artistProfile.lastName, "UpdatedLastName");
    assert.equal(artistProfile.nationality, "UpdatedNationality");
    assert.equal(artistProfile.age.toNumber(), 50);
  });

  // Test pour vérifier que la mise à jour d'un profil d'artiste inexistant est interdite
  it("Should not allow to update non-existent artist profile", async function() {
    try {
      // Tente de mettre à jour un profil d'artiste qui n'a pas encore été créé
      await artist.updateArtistProfile("UpdatedFirstName", "UpdatedLastName", "UpdatedNationality", 50, { from: accounts[0] });
    } catch (err) {
      // Vérifie que l'erreur est bien un 'revert', ce qui indique que l'opération a été refusée
      assert(err.message.indexOf('revert') >= 0, "Expected revert error, but got: " + err.message);
    }
  });

  // Test pour vérifier que seuls les artistes eux-mêmes peuvent mettre à jour leur profil
  it("Should not allow others to update artist profile", async function() {
    // Création d'un profil d'artiste
    await artist.createArtistProfile("FirstName", "LastName", "Nationality", 40, { from: accounts[0] });

    try {
      // Tente de mettre à jour le profil d'artiste à partir d'un autre compte
      await artist.updateArtistProfile("UpdatedFirstName", "UpdatedLastName", "UpdatedNationality", 50, { from: accounts[1] });
    } catch (err) {
      // Vérifie que l'erreur est bien un 'revert', ce qui indique que l'opération a été refusée
      assert(err.message.indexOf('revert') >= 0, "Expected revert error, but got: " + err.message);
    }
  });
  
  // Test pour vérifier que la requête d'un profil d'artiste inexistant retourne un profil vide
  it("Should return empty profile for non-existent artist", async function() {
    // Récupération d'un profil d'artiste inexistant
    const artistProfile = await artist.artists(accounts[0]);

    // Vérification que tous les champs du profil sont vides ou nuls
    assert.equal(artistProfile.firstName, "");
    assert.equal(artistProfile.lastName, "");
    assert.equal(artistProfile.nationality, "");
    assert.equal(artistProfile.age.toNumber(), 0);
  });

// Test pour vérifier que la création d'un profil d'artiste déjà existant est interdite
it("Should not allow to create an existing artist profile", async function() {
  // Création d'un profil d'artiste
  await artist.createArtistProfile("FirstName", "LastName", "Nationality", 40, { from: accounts[0] });

  try {
    // Tente de créer un profil d'artiste déjà existant
    await artist.createArtistProfile("FirstName", "LastName", "Nationality", 40, { from: accounts[0] });
  } catch (err) {
    // Vérifie que l'erreur est bien un 'revert', ce qui indique que l'opération a été refusée
    assert(err.message.indexOf('revert') >= 0, "Expected revert error, but got: " + err.message);
  }
});

it("Should not allow to create an artist profile with missing details", async function() {
  try {
    // Tente de créer un profil d'artiste avec des détails manquants
    await artist.createArtistProfile("", "LastName", "Nationality", 40, { from: accounts[0] });
  } catch (err) {
    // Vérifie que l'erreur est bien un 'revert', ce qui indique que l'opération a été refusée
    assert(err.message.indexOf('revert') >= 0, "Expected revert error, but got: " + err.message);
  }

  try {
    // Tente de créer un profil d'artiste avec un âge nul
    await artist.createArtistProfile("FirstName", "LastName", "Nationality", 0, { from: accounts[0] });
  } catch (err) {
    // Vérifie que l'erreur est bien un 'revert', ce qui indique que l'opération a été refusée
    assert(err.message.indexOf('revert') >= 0, "Expected revert error, but got: " + err.message);
  }
});



});
