var connection = require('../functions/connect.cy.js');

class Scenario {
  //This function create a scenario. Accepted values for the master argument are "master" or "child",
  //accepted values for the runType argument are "BreweryParameters" or "NoParameters"
  static createScenario(scenarioName, master, dataset, runType) {
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
    // Search for the correct scenario, select it with down arrow and type enter to validate.
    cy.get('#scenario-manager-search-field').click().clear().type(scenarioName);
    cy.wait(500);
    // Check the correct scenario is diplayed
    cy.get('[aria-label="' + scenarioName + '"]').should('exist');
  }

  static searchMaybeNotExistingScenarioInManager(scenarioName) {
    // Search for the correct scenario, select it with down arrow and type enter to validate.
    cy.get('#scenario-manager-search-field').click().clear().type(scenarioName);
    cy.wait(500);
  }

  static searchScenarioInView(scenarioName) {
    // Search for the correct scenario, select it with down arrow and type enter to validate.
    cy.get('[placeholder="Scenario"]').type(scenarioName, { force: true }).type('{downarrow}{enter}', { force: true });
    cy.wait(500);
    // Check the correct scenario is diplayed
    cy.get('[placeholder="Scenario"]').should('have.attr', 'value', scenarioName);
  }

  static runScenario(scenarioName) {
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

  // Works only if the search returns one scenario.
  static deleteScenario(scenarioName) {
    this.searchMaybeNotExistingScenarioInManager(scenarioName);
    cy.wait(1000);
    cy.get('[data-cy="scenario-manager-view"]').then(($ele) => {
      if ($ele.find('[class="rst__tree"]').length === 0) {
        cy.log('No scenario to delete');
      } else {
        cy.get('[data-cy="scenario-delete-button"]').click({ multiple: true });
        cy.contains('Confirm', { timeout: 60000 }).click();
        cy.get('[aria-label="' + scenarioName + '"]').should('not.exist');
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
    // Search the scenario
    this.searchScenarioInView(scenarioName);
    // Validated the scenario
    cy.get('[data-cy="validate-scenario-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="scenario-validation-status"]').should('exist');
  }

  static rejectScenario(scenarioName) {
    // Search the scenario
    this.searchScenarioInView(scenarioName);
    // Validated the scenario
    cy.get('[data-cy="reject-scenario-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="scenario-validation-status"]').should('exist');
  }

  static cancelValidationScenario(scenarioName) {
    // Search the scenario
    this.searchScenarioInView(scenarioName);
    // Validated the scenario
    cy.get('[data-testid="CancelIcon"]').click();
    cy.wait(1000);
    cy.get('[data-cy="validate-scenario-button"]').should('exist');
    cy.get('[data-cy="reject-scenario-button"]').should('exist');
  }
}

module.exports = Scenario;
