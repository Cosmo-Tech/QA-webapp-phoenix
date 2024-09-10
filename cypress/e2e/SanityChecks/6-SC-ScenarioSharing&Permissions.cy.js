import 'cypress-file-upload';
var connection = require('../../functions/connect.cy.js');
var datasetManager = require('../../functions/datasetManager.cy.js');
var config = require('../../../variables.cy.js');
var scenario = require('../../functions/scenario.cy.js');

describe('Scenario sharing feature and permissions', () => {
  it('PROD-13738 -> Share a scenario', () => {
    connection.connect();
    var scenarioName = 'PROD-13738-ShareScenario';

    // Delete scenario in case it's a retry
    scenario.deleteScenario(scenarioName);

    connection.navigate('scenario-view');
    scenario.createScenario(scenarioName, 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');

    // Click on share button and search for someone not in the organization
    cy.wait(2000);
    cy.get('[data-cy="share-scenario-button"]').click();
    cy.get('[placeholder="Add people"]').click().type('personne');
    // No option should be found
    cy.get('[data-cy*="share-scenario-dialog-agents-select-"]').should('not.exist');
    cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').click({ force: true });

    // Share the "viewer" permissions with someone
    scenario.shareScenarioWithUser(scenarioName, config.permissionUserEmail(), config.permissionUserName(), 'viewer');

    // Remove access then cancel -> check access is not removed
    cy.get('[data-cy="share-scenario-button"]').click();
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
    cy.get('[data-cy="share-scenario-button"]').click();
    cy.get('[role="dialog"]').should('contain', config.permissionUserEmail());
    cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').click({ force: true });

    // Remove the user access
    scenario.removeScenarioPermissionsUser(scenarioName, config.permissionUserEmail(), config.permissionUserName());

    // Share the "editor" permissions with someone
    scenario.shareScenarioWithUser(scenarioName, config.permissionUserEmail(), config.permissionUserName(), 'editor');

    // Remove the user access
    scenario.removeScenarioPermissionsUser(scenarioName, config.permissionUserEmail(), config.permissionUserName());

    // Share the "validator" permissions with someone
    scenario.shareScenarioWithUser(scenarioName, config.permissionUserEmail(), config.permissionUserName(), 'validator');

    // Remove the user access
    scenario.removeScenarioPermissionsUser(scenarioName, config.permissionUserEmail(), config.permissionUserName());

    // Share the "admin" permissions with someone
    scenario.shareScenarioWithUser(scenarioName, config.permissionUserEmail(), config.permissionUserName(), 'admin');

    // Check you're still admin even with someone else admin too. If no longer admin, delete button is no longer visible
    connection.navigate('manager');
    scenario.searchScenarioInManager(scenarioName);
    cy.get('[data-testid="DeleteForeverIcon"').should('exist');
    cy.get('[data-cy="scenario-view-redirect"]').click();

    // Remove the user access
    scenario.removeScenarioPermissionsUser(scenarioName, config.permissionUserEmail(), config.permissionUserName());

    // Update global permission to 'viewer'
    scenario.updateScenarioGlobalSharing(scenarioName, 'viewer');

    // Update global permission to 'editor'
    scenario.updateScenarioGlobalSharing(scenarioName, 'editor');

    // Update global permission to 'validator'
    scenario.updateScenarioGlobalSharing(scenarioName, 'validator');

    // Update global permission to 'admin'
    scenario.updateScenarioGlobalSharing(scenarioName, 'admin');

    // Update global permission to 'viewer'
    scenario.updateScenarioGlobalSharing(scenarioName, 'viewer');

    // Remove global permissions
    scenario.removeScenarioPermissionsGlobal(scenarioName);

    // Additionnal test: check it's not possible to remove the last admin
    cy.get('[data-cy="share-scenario-button"]').click();
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
            cy.get('[data-cy="no-admin-error-message"]').should('contain', 'The scenario must have at least one admin');
            cy.get('[data-cy="share-scenario-dialog-submit-button"]').should('have.attr', 'disabled');
            // Get out of the loop
            return false;
          }
        });
      });
    cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').click({ force: true });

    // Clean the scenario
    scenario.deleteScenario(scenarioName);
  });

  it('PROD-13739 -> Check scenario permissions, need to be completed manually', () => {
    connection.connect();
    connection.navigate('scenario-view');

    // Clean in case it's a second try
    scenario.deleteScenario('PROD-13240-Admin');
    scenario.deleteScenario('PROD-13240-Validator');
    scenario.deleteScenario('PROD-13240-Editor');
    scenario.deleteScenario('PROD-13240-Viewer');

    // Create the scenario and share admin permissions with someone
    scenario.createScenario('PROD-13240-Admin', 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');
    scenario.shareScenarioWithUser('PROD-13240-Admin', config.permissionUserEmail(), config.permissionUserName(), 'admin');

    // Create the scenario and share validator permissions with someone
    scenario.createScenario('PROD-13240-Validator', 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');
    scenario.shareScenarioWithUser('PROD-13240-Validator', config.permissionUserEmail(), config.permissionUserName(), 'validator');

    // Create the scenario and share editor permissions with someone
    scenario.createScenario('PROD-13240-Editor', 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');
    scenario.shareScenarioWithUser('PROD-13240-Editor', config.permissionUserEmail(), config.permissionUserName(), 'editor');

    // Create the scenario and share viewer permissions with someone
    scenario.createScenario('PROD-13240-Viewer', 'master', 'Reference-for-all-scenario-creation-tests', 'BreweryParameters');
    scenario.shareScenarioWithUser('PROD-13240-Viewer', config.permissionUserEmail(), config.permissionUserName(), 'viewer');

    // Scenarios are not deleted, as they have to be manually checked. They will be deleted in the test SC-after.cy.js
  });
});
