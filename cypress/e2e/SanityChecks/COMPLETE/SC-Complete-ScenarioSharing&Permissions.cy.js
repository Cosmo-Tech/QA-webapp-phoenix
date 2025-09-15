import 'cypress-file-upload';
const connection = require('../../../functions/connect.cy.js');
const datasetManager = require('../../../functions/datasetManager.cy.js');
const config = require('../../../../variables.cy.js');
const scenario = require('../../../functions/scenario.cy.js');

describe('Scenario sharing feature and permissions', () => {
  it('PROD-13738 -> Share a scenario', () => {
    connection.connect();
    const scenarioName = 'DLOP-PROD-13738-ShareScenario';

    // Delete scenario in case it's a retry
    scenario.deleteScenario(scenarioName);

    connection.navigate('scenario-view');
    scenario.createScenario(scenarioName, 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');

    // Click on share button and search for someone not in the organization
    cy.wait(2000);
    cy.get('[data-cy="share-scenario-button"]').click();
    cy.get('[placeholder="Add people"]').click().type('personne');
    // No option should be found
    cy.get('[data-cy*="share-scenario-dialog-agents-select-"]').should('not.exist');
    cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').click({ force: true });

     // Share the "admin" permissions with the QA team
    scenario.shareScenarioWithQATeam(scenarioName, 'admin');

    // Check you're still admin even with someone else admin too. If no longer admin, delete button is no longer visible
    connection.navigate('manager');
    scenario.searchScenarioInManager(scenarioName);
    cy.get('[data-testid="DeleteForeverIcon"').should('exist');
    cy.get('[data-cy="scenario-view-redirect"]').click();

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
          let userName = $txt.text();
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
    scenario.deleteScenario('DLOP-PROD-13739-Admin');
    scenario.deleteScenario('DLOP-PROD-13739-Validator');
    scenario.deleteScenario('DLOP-PROD-13739-Editor');
    scenario.deleteScenario('DLOP-PROD-13739-Viewer');

    // Create the scenario and share admin permissions with someone
    scenario.createScenario('DLOP-PROD-13739-Admin', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');
    scenario.shareScenarioWithQATeam('DLOP-PROD-13739-Admin', 'admin');

    // Create the scenario and share validator permissions with someone
    scenario.createScenario('DLOP-PROD-13739-Validator', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');
    scenario.shareScenarioWithQATeam('DLOP-PROD-13739-Validator', 'validator');

    // Create the scenario and share editor permissions with someone
    scenario.createScenario('DLOP-PROD-13739-Editor', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');
    scenario.shareScenarioWithQATeam('DLOP-PROD-13739-Editor', 'editor');

    // Create the scenario and share viewer permissions with someone
    scenario.createScenario('DLOP-PROD-13739-Viewer', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');
    scenario.shareScenarioWithQATeam('DLOP-PROD-13739-Viewer', 'viewer');

    // Scenarios are not deleted, as they have to be manually checked. They will be deleted in the test SC-after.cy.js
  });
});
