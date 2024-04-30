import 'cypress-file-upload';
var connection = require('../../functions/connect.cy.js');
var datasetManager = require('../../functions/datasetManager.cy.js');
var config = require('../../../variables.cy');

describe('Dataset Manager Sanity Checks', () => {
  it('PROD-13233 -> Share a dataset', () => {
    connection.connect();
    connection.navigate('dataset');
    var datasetName = 'PROD-13233-Reference';
    // Create the dataset
    datasetManager.createDatasetLocalFile(datasetName, 'A basic reference dataset for brewery model', 'reference_dataset');
    datasetManager.selectDataset(datasetName);
    cy.wait(1000);

    // Click on share button and search for someone not in the organization
    cy.get('[data-testid="ShareIcon"]').click();
    cy.get('[placeholder="Add people"]').click().type('personne');
    // No option should be found
    cy.get('[data-cy*="share-scenario-dialog-agents-select-"]').should('not.exist');
    cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').click({ force: true });
    datasetManager.clearSearch();

    // Share the "viewer" permissions with someone
    datasetManager.shareDatasetUser(datasetName, config.permissionUserEmail(), config.permissionUserName(), 'viewer');

    // Remove access then cancel -> check access is not removed
    datasetManager.selectDataset(datasetName);
    cy.wait(1000);
    // Click on share button
    cy.get('[data-testid="ShareIcon"]').click();
    // Pass each user listed in the sharing wizard and check if the name is already here
    cy.get('[role="dialog"]')
      .find('[data-cy="role-editor-agent-name"]')
      .then(($el) => {
        cy.get($el).each(($txt) => {
          // Recover the text of the user names listed
          var userName = $txt.text();
          if (userName === config.permissionUserEmail()) {
            // Once the user is found, the access is removed by clicking the role dropdown menu and remove the role
            cy.get('[data-cy*="role-editor-' + config.permissionUserName() + '"]')
              .find('[aria-haspopup="listbox"]')
              .click({ force: true });
            cy.get('[data-cy="select-action-name"]').click({ force: true });
            // CANCEL the action
            cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').click({ force: true });
            // Get out of the loop
            return false;
          }
        });
      });
    // Reopen the share wizard and check if the user is still here
    cy.get('[data-testid="ShareIcon"]').click();
    cy.get('[role="dialog"]').should('contain', config.permissionUserEmail());
    cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').click({ force: true });
    datasetManager.clearSearch();

    // Remove the user access
    datasetManager.removeDatasetPermissionsUser(datasetName, config.permissionUserEmail(), config.permissionUserName());

    // Share the "editor" permissions with someone
    datasetManager.shareDatasetUser(datasetName, config.permissionUserEmail(), config.permissionUserName(), 'editor');

    // Remove the user access
    datasetManager.removeDatasetPermissionsUser(datasetName, config.permissionUserEmail(), config.permissionUserName());

    // Share the "admin" permissions with someone
    datasetManager.shareDatasetUser(datasetName, config.permissionUserEmail(), config.permissionUserName(), 'admin');

    // Check you're still admin even with someone else admin too. If no longer admin, delete button is no longer visible
    cy.get('[data-testid="DeleteForeverIcon"').should('exist');

    // Remove the user access
    datasetManager.removeDatasetPermissionsUser(datasetName, config.permissionUserEmail(), config.permissionUserName());

    // Update global permission to 'viewer'
    datasetManager.updateDatasetGlobal(datasetName, 'viewer');

    // Update global permission to 'editor'
    datasetManager.updateDatasetGlobal(datasetName, 'editor');

    // Update global permission to 'admin'
    datasetManager.updateDatasetGlobal(datasetName, 'admin');

    // Update global permission to 'viewer'
    datasetManager.updateDatasetGlobal(datasetName, 'viewer');

    // Remove global permissions
    datasetManager.removeDatasetPermissionsGlobal(datasetName);

    // Additionnal test: check it's not possible to remove the last admin
    datasetManager.selectDataset(datasetName);
    cy.wait(500);
    cy.get('[data-testid="ShareIcon"]').click();
    // Pass each user listed in the sharing wizard to find the owner
    cy.get('[role="dialog"]')
      .find('[data-cy="role-editor-agent-name"]')
      .then(($el) => {
        cy.get($el).each(($txt) => {
          // Recover the text of the user names listed
          var userName = $txt.text();
          if (userName === 'dev.sample.webapp@example.com') {
            // Once the owner is found, the access is removed by clicking the role dropdown menu and remove the role
            cy.get('[data-cy="role-editor-devsamplewebappexamplecom"]').find('[aria-haspopup="listbox"]').click({ force: true });
            cy.get('[data-cy="select-action-name"]').click({ force: true });
            // Check there is a warning message
            cy.get('[data-cy="no-admin-error-message"]').should('contain', 'The dataset must have at least one admin');
            cy.get('[data-cy="share-scenario-dialog-submit-button"]').should('have.attr', 'disabled');
            // Get out of the loop
            return false;
          }
        });
      });
    cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').click({ force: true });
    datasetManager.clearSearch();
  });
});
