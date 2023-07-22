// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

/// @title Contrat Migrations
/// @dev Ce contrat gère les migrations lors du déploiement
contract Migrations {
    address public owner;                // Adresse du propriétaire du contrat
    uint public last_completed_migration; // La dernière migration effectuée

    /// @notice Constructeur du contrat
    /// @dev Initialise le propriétaire avec l'adresse de celui qui déploie le contrat
    constructor() {
        owner = msg.sender;
    }

    /// @notice Modifier pour restreindre l'accès à certaines fonctions
    /// @dev Vérifie que l'appelant est le propriétaire du contrat
    modifier restricted() {
        if (msg.sender == owner) _;
    }

    /// @notice Met à jour la dernière migration effectuée
    /// @param completed Numéro de la dernière migration effectuée
    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }

    /// @notice Met à jour l'adresse du contrat Migrations
    /// @param new_address Nouvelle adresse du contrat Migrations
    function upgrade(address new_address) public restricted {
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }
}
