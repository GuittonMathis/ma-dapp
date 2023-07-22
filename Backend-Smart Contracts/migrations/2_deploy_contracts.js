const Artist = artifacts.require("Artist");
const Artwork = artifacts.require("Artwork");
const Marketplace = artifacts.require("Marketplace");

module.exports = function(deployer) {
  deployer.deploy(Artist);
  deployer.deploy(Artwork);
  deployer.deploy(Marketplace);
};
