var connection = require('../functions/connect.cy.js');

class Scenario {
  //This function create a scenario. Accepted values for the master argument are "master" or "child",
  //accepted values for the runType argument are "BreweryParameters" or "NoParameters"
  static createScenario(scenarioName, master, dataset, runType) {
    connection.navigate('scenario-view');
    // Go to the scenario view page and click on create
    cy.get('[data-cy="create-scenario-button"]').click({ force: true });
    // Enter the provided values
    cy.get('#scenarioName').click().type(scenarioName);
    // Master or child scenario, choose dataset or parent
    if (master === 'master') {
      cy.get('[data-cy="create-scenario-dialog-master-checkbox"]').click({ force: true });
      cy.get('[placeholder="Select a dataset"]').click().clear().type(dataset).type('{downarrow}{enter}');
    } else if (master === 'child') {
      // No need to do uncheck the box, by default the box is not checked
      cy.get('[placeholder="Parent Scenario"]').click().clear().type(dataset).type('{downarrow}{enter}');
    } else {
      cy.log('Unknown value. This function accepts only "master" or "child" as values.');
    }
    // Choose run type. Currently accepts "BreweryParameters" and "NoParameters"
    if (runType === 'BreweryParameters') {
      cy.get('[id="scenarioType"]').click({ force: true });
      cy.get('[id="scenarioType"]').click().clear().type('Run template with Brewery parameters').type('{downarrow}{enter}');
    } else if (runType === 'NoParameters') {
      cy.get('[id="scenarioType"]').click({ force: true });
      cy.get('[id="scenarioType"]').click().clear().type('Run template without parameters').type('{downarrow}{enter}');
    } else {
      cy.log('Unknown value. This function accepts only "BreweryParameters" or "NoParameters" as values.');
    }
    // Validate the scenario creation
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').click({ force: true });
    // Check the scenario is created, can't use the dashboards as it's not connected in local
    cy.wait(1000);
    this.searchScenarioInView(scenarioName);
  }

  // Create scenario with ID recovering but tests needs to be done in the

  /*static createScenarioWithID(scenarioName, master, dataset, runType) {
    cy.intercept({ method: 'POST', url: 'https://dev.api.cosmotech.com/phoenix/v3-1/organizations/O-gZYpnd27G7/workspaces/w-70klgqeroooz/scenarios', times: 1 }, (req) => {
      req.continue();
    }).as('requeteScenario');

     // Go to the scenario view page and click on create
     cy.get('[data-cy="create-scenario-button"]').click({ force: true });
     // Enter the provided values
     cy.get('#scenarioName').click().type(scenarioName);
     // Master or child scenario, choose dataset or parent
     if (master === 'master') {
       cy.get('[data-cy="create-scenario-dialog-master-checkbox"]').click({ force: true });
       cy.get('[placeholder="Select a dataset"]').click().clear().type(dataset).type('{downarrow}{enter}');
     } else if (master === 'child') {
       // No need to do uncheck the box, by default the box is not checked
       cy.get('[placeholder="Parent Scenario"]').click().clear().type(dataset);
     } else {
       cy.log('Unknown value. This function accepts only "master" or "child" as values.');
     }
     // Choose run type. Currently accepts "BreweryParameters" and "NoParameters"
     if (runType === 'BreweryParameters') {
       cy.get('[data-cy="create-scenario-dialog-type-select"]').click({ force: true });
       cy.get('[placeholder="Select a dataset"]').click().clear().type('Run template with Brewery parameters').type('{downarrow}{enter}');
     } else if (runType === 'NoParameters') {
       cy.get('[data-cy="create-scenario-dialog-type-select"]').click({ force: true });
       cy.get('[placeholder="Select a dataset"]').click().clear().type('Run template without parameters').type('{downarrow}{enter}');
     } else {
       cy.log('Unknown value. This function accepts only "BreweryParameters" or "NoParameters" as values.');
     }
     // Validate the scenario creation
     cy.get('[data-cy="create-scenario-dialog-submit-button"]').click({ force: true });

    cy.wait('@requeteScenario').then((intercept) => {
      cy.wrap(intercept.response.body.id).as('interceptId');
    });
    // do all actions needing the id here
    cy.get('@interceptId').then((id) => console.log(id));
  }*/

  // WARNING: for now, the function only manage unique names,
  // if the search function find two scenarios, it may cause an error
  // example: scenario 1 is named "Toto", scenario 2 is named "Toto2"
  // if you search for the first scenario "Toto", both scenario will be returned and the order may cause
  // the selection of the first scenario not beeing the one expected

  static searchScenarioInManager(scenarioName) {
    connection.navigate('manager');
    // Search for the correct scenario, select it with down arrow and type enter to validate.
    cy.get('#scenario-manager-search-field').click().clear().type(scenarioName);
    cy.wait(500);
    // Check the correct scenario is diplayed
    cy.get('[aria-label="' + scenarioName + '"]').should('exist');
  }

  static searchMaybeNotExistingScenarioInManager(scenarioName) {
    connection.navigate('manager');
    // Search for the correct scenario, select it with down arrow and type enter to validate.
    cy.get('#scenario-manager-search-field').click().clear().type(scenarioName);
    cy.wait(500);
  }

  static searchScenarioInView(scenarioName) {
    connection.navigate('scenario-view');
    cy.wait(1000);
    // Search for the correct scenario, select it with down arrow and type enter to validate.
    cy.get('[placeholder="Scenario"]').type(scenarioName, { force: true }).type('{downarrow}{enter}', { force: true });
    cy.wait(2000);
    // Check the correct scenario is diplayed
    cy.get('[placeholder="Scenario"]').should('have.attr', 'value', scenarioName);
  }

  static runScenario(scenarioName) {
    connection.navigate('scenario-view');
    // Search the scenario
    this.searchScenarioInView(scenarioName);
    // Run the scenario
    cy.get('[data-cy="launch-scenario-button"]').click();
    cy.wait(5000);
    // Wait until the end of the simulation (5 min timeout)
    cy.get('[data-cy="stop-scenario-run-button"]', { timeout: 300000 }).should('not.exist');
    // Check the simulation is successful
    connection.navigate('manager');
    this.searchScenarioInManager(scenarioName);
    cy.wait(500);
    cy.get('[data-cy*="scenario-accordion-"]').click();
    cy.wait(500);
    cy.get('[data-cy="scenario-status-successful"]').should('exist');
  }

  // Start a simulation then cancel it
  static cancelRunSimulation(scenarioName) {
    connection.navigate('scenario-view');
    // Search the scenario
    this.searchScenarioInView(scenarioName);
    // Run the scenario
    cy.get('[data-cy="launch-scenario-button"]').click();
    // Wait 5 seconds
    cy.wait(5000);
    // Abort the simulation
    cy.get('[data-cy="stop-scenario-run-button"]').click();
    // Confirm abortion
    cy.get('[data-cy="cancel-run-button2"]').click();
    // Check it fails
    cy.get('[data-cy="stop-scenario-run-button"]', { timeout: 300000 }).should('not.exist');
    cy.get('[data-cy="dashboard-placeholder"]', { timeout: 300000 }).should('contain', 'An error occurred during the scenario run');
  }

  // Works only if the search returns one or no scenario.
  static deleteScenario(scenarioName) {
    connection.navigate('manager');
    this.searchMaybeNotExistingScenarioInManager(scenarioName);
    cy.wait(1000);
    cy.get('[data-cy="scenario-manager-view"]').then(($ele) => {
      if ($ele.find('[class="rst__tree"]').length === 0) {
        cy.log('No scenario to delete');
      } else {
        cy.get('[data-cy="scenario-delete-button"]').click({ multiple: true });
        cy.contains('Confirm', { timeout: 60000 }).click();
        cy.wait(2000);
        cy.get('[aria-label="' + scenarioName + '"]', { timeout: 60000 }).should('not.exist', { timeout: 60000 });
      }
    });
  }

  // Warning, this function will delete ALL the scenarios.
  static deleteAllScenario() {
    connection.navigate('manager');
    cy.get('[data-testid="DeleteForeverIcon"]').each(($el) => {
      cy.wrap($el).click();
      cy.contains('Confirm', { timeout: 60000 }).click();
    });
  }

  static validateScenario(scenarioName) {
    connection.navigate('scenario-view');
    // Search the scenario
    this.searchScenarioInView(scenarioName);
    // Validated the scenario
    cy.get('[data-cy="validate-scenario-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="scenario-validation-status"]').should('exist');
  }

  static rejectScenario(scenarioName) {
    connection.navigate('scenario-view');
    // Search the scenario
    this.searchScenarioInView(scenarioName);
    // Validated the scenario
    cy.get('[data-cy="reject-scenario-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="scenario-validation-status"]').should('exist');
  }

  static cancelValidationScenario(scenarioName) {
    connection.navigate('scenario-view');
    // Search the scenario
    this.searchScenarioInView(scenarioName);
    // Validated the scenario
    cy.get('[data-testid="CancelIcon"]').click();
    cy.wait(1000);
    cy.get('[data-cy="validate-scenario-button"]').should('exist');
    cy.get('[data-cy="reject-scenario-button"]').should('exist');
  }

  // User has to be an email address.
  // Name is fist and second name aglomerated (ie. john doe => johndoe)
  // Only accepted values for permissions are viewer, editor, validator or admin
  static shareScenarioWithUser(scenarioName, user, name, permission) {
    this.searchScenarioInView(scenarioName);
    cy.wait(1000);
    // Click on share button
    cy.get('[data-cy="share-scenario-button"]').click();
    // Check the wizard
    cy.get('[data-cy="share-scenario-dialog-title"]').should('contain', 'Share ' + scenarioName);
    cy.get('[placeholder="Add people"]').should('exist');
    cy.get('[role="dialog"]').should('contain', 'Users access');
    cy.get('[role="dialog"]').should('contain', 'General access');
    cy.get('[role="dialog"]').should('contain', 'Workspace');
    cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').should('exist');
    cy.get('[data-cy="share-scenario-dialog-submit-button"]').should('exist');

    // Search for the user, check all roles are available and select the correct role
    cy.get('[placeholder="Add people"]').click().type(user);
    cy.get('[data-cy*="share-scenario-dialog-agents-select-' + name + '"]').click({ force: true });
    cy.get('[data-cy="share-scenario-dialog-roles-checkbox-viewer"]').should('exist');
    cy.get('[data-cy="share-scenario-dialog-roles-checkbox-editor"]').should('exist');
    cy.get('[data-cy="share-scenario-dialog-roles-checkbox-validator"]').should('exist');
    cy.get('[data-cy="share-scenario-dialog-roles-checkbox-admin"]').should('exist');
    cy.get('[data-cy="share-scenario-dialog-roles-checkbox-' + permission + '"]').click({ force: true });
    // Confirm
    cy.get('[data-cy=share-scenario-dialog-confirm-add-access-button]').click();
    cy.get('[data-cy="share-scenario-dialog-submit-button"]').click({ force: true });
  }

  // User has to be an email address.
  // Name is fist and second name aglomerated (ie. john doe => johndoe)
  // Only accepted values for permissions are viewer, editor, validator or admin
  static updateScenarioPermissionsUser(scenarioName, user, name, permission) {
    this.searchScenarioInView(scenarioName);
    cy.wait(1000);
    // Click on share button
    cy.get('[data-cy="share-scenario-button"]').click();
    // Check the wizard
    cy.get('[data-cy="share-scenario-dialog-title"]').should('contain', 'Share ' + scenarioName);
    cy.get('[placeholder="Add people"]').should('exist');
    cy.get('[role="dialog"]').should('contain', 'Users access');
    cy.get('[role="dialog"]').should('contain', 'General access');
    cy.get('[role="dialog"]').should('contain', 'Workspace');
    cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').should('exist');
    cy.get('[data-cy="share-scenario-dialog-submit-button"]').should('exist');
    // Pass each user listed in the sharing wizard and check if the name is already here
    cy.get('[role="dialog"]')
      .find('[data-cy="role-editor-agent-name"]')
      .then(($el) => {
        cy.get($el).each(($txt) => {
          // Recover the text of the user names listed
          var userName = $txt.text();
          if (userName === user) {
            // Once the user is found, the access is updated by clicking the role dropdown menu and select the new role
            cy.get('[data-cy*="role-editor-' + name + '"]')
              .find('[aria-haspopup="listbox"]')
              .click({ force: true });
            // Check all options are available and select the role
            cy.get('[data-value="viewer"]').should('exist');
            cy.get('[data-value="editor"]').should('exist');
            cy.get('[data-value="validator"]').should('exist');
            cy.get('[data-value="admin"]').should('exist');
            cy.get('[value="remove_specific_access"]').should('exist');
            cy.get('[data-cy="select-option-' + permission + '"]').click({ force: true });
            // Validate
            cy.get('[data-cy="share-scenario-dialog-submit-button"]').click({ force: true });
            return false;
          }
        });
      });
  }

  // Only accepted values for permissions are viewer, editor, validator or admin
  static updateScenarioGlobalSharing(scenarioName, permission) {
    this.searchScenarioInView(scenarioName);
    cy.wait(1000);
    // Click on share button
    cy.get('[data-cy="share-scenario-button"]').click();
    // Check the wizard
    cy.get('[data-cy="share-scenario-dialog-title"]').should('contain', 'Share ' + scenarioName);
    cy.get('[placeholder="Add people"]').should('exist');
    cy.get('[role="dialog"]').should('contain', 'Users access');
    cy.get('[role="dialog"]').should('contain', 'General access');
    cy.get('[role="dialog"]').should('contain', 'Workspace');
    cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').should('exist');
    cy.get('[data-cy="share-scenario-dialog-submit-button"]').should('exist');
    // Pass each user listed in the sharing wizard and check if the name is already here
    cy.get('[role="dialog"]')
      .find('[data-cy="role-editor-agent-name"]')
      .then(($el) => {
        cy.get($el).each(($txt) => {
          // Recover the text of the user names listed
          var userName = $txt.text();
          if (userName === 'Workspace') {
            // Once the user is found, the access is updated by clicking the role dropdown menu and select the new role
            cy.get('[data-cy*="role-editor-Workspace"]').find('[aria-haspopup="listbox"]').click({ force: true });
            // Check all permissions are available
            cy.get('[data-cy="select-option-none"]').should('exist');
            cy.get('[data-cy="select-option-viewer"]').should('exist');
            cy.get('[data-cy="select-option-editor"]').should('exist');
            cy.get('[data-cy="select-option-validator"]').should('exist');
            cy.get('[data-cy="select-option-admin"]').should('exist');
            cy.get('[data-value="' + permission + '"]').click({ force: true });
            // Validate
            cy.get('[data-cy="share-scenario-dialog-submit-button"]').click({ force: true });
            return false;
          }
        });
      });
  }

  // User has to be an email address.
  // Name is fist and second name aglomerated (ie. john doe => johndoe)
  static removeScenarioPermissionsUser(scenarioName, user, name) {
    this.searchScenarioInView(scenarioName);
    cy.wait(1000);
    // Click on share button
    cy.get('[data-cy="share-scenario-button"]').click();
    // Check the wizard
    cy.get('[data-cy="share-scenario-dialog-title"]').should('contain', 'Share ' + scenarioName);
    cy.get('[placeholder="Add people"]').should('exist');
    cy.get('[role="dialog"]').should('contain', 'Users access');
    cy.get('[role="dialog"]').should('contain', 'General access');
    cy.get('[role="dialog"]').should('contain', 'Workspace');
    cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').should('exist');
    cy.get('[data-cy="share-scenario-dialog-submit-button"]').should('exist');
    // Pass each user listed in the sharing wizard and check if the name is already here
    cy.get('[role="dialog"]')
      .find('[data-cy="role-editor-agent-name"]')
      .then(($el) => {
        cy.get($el).each(($txt) => {
          // Recover the text of the user names listed
          var userName = $txt.text();
          if (userName === user) {
            // Once the user is found, the access is updated by clicking the role dropdown menu and select the new role
            cy.get('[data-cy*="role-editor-' + name + '"]')
              .find('[aria-haspopup="listbox"]')
              .click({ force: true });
            // Check all permissions are available
            cy.get('[data-value="viewer"]').should('exist');
            cy.get('[data-value="editor"]').should('exist');
            cy.get('[data-value="validator"]').should('exist');
            cy.get('[data-value="admin"]').should('exist');
            cy.get('[value="remove_specific_access"]').should('exist');
            cy.get('[data-cy="select-action-name"]').click({ force: true });
            // Validate
            cy.get('[data-cy="share-scenario-dialog-submit-button"]').click({ force: true });
            return false;
          }
        });
        // Check user is removed
        cy.wait(1000);
        cy.get('[data-cy="share-scenario-button"]').click();
        cy.get('[role="dialog"]').should('not.contain', user);
        cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').click({ force: true });
      });
  }

  static removeScenarioPermissionsGlobal(scenarioName) {
    this.searchScenarioInView(scenarioName);
    cy.wait(1000);
    // Click on share button
    cy.get('[data-cy="share-scenario-button"]').click();
    // Check the wizard
    cy.get('[data-cy="share-scenario-dialog-title"]').should('contain', 'Share ' + scenarioName);
    cy.get('[placeholder="Add people"]').should('exist');
    cy.get('[role="dialog"]').should('contain', 'Users access');
    cy.get('[role="dialog"]').should('contain', 'General access');
    cy.get('[role="dialog"]').should('contain', 'Workspace');
    cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').should('exist');
    cy.get('[data-cy="share-scenario-dialog-submit-button"]').should('exist');
    // Pass each user listed in the sharing wizard and check if the name is already here
    cy.get('[role="dialog"]')
      .find('[data-cy="role-editor-agent-name"]')
      .then(($el) => {
        cy.get($el).each(($txt) => {
          // Recover the text of the user names listed
          var userName = $txt.text();
          if (userName === 'Workspace') {
            // Once the user is found, the access is updated by clicking the role dropdown menu and select the new role
            cy.get('[data-cy*="role-editor-Workspace"]').find('[aria-haspopup="listbox"]').click({ force: true });
            // Check all permissions are available
            cy.get('[data-cy="select-option-none"]').should('exist');
            cy.get('[data-cy="select-option-viewer"]').should('exist');
            cy.get('[data-cy="select-option-editor"]').should('exist');
            cy.get('[data-cy="select-option-validator"]').should('exist');
            cy.get('[data-cy="select-option-admin"]').should('exist');
            cy.get('[data-value="none"]').click({ force: true });
            // Validate
            cy.get('[data-cy="share-scenario-dialog-submit-button"]').click({ force: true });
            return false;
          }
        });
      });
  }
}

module.exports = Scenario;
