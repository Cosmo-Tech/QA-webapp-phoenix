var connection = require('../functions/connect.cy.js');

class Scenario {
  //This function create a scenario. Accepted values for the master argument are "master" or "child"
  static createScenario(scenarioName, master, dataset) {
    // Go to the scenario view page and click on create
    connection.navigate('view');
    cy.get('[data-cy="create-scenario-button"]').click({ force: true });
    // Enter the provided values
    cy.get('#scenarioName').click().type(scenarioName);
    if (master === 'master') {
      cy.get('[data-cy="create-scenario-dialog-master-checkbox"]').click({ force: true });
      cy.get('[placeholder="Select a dataset"]').click().clear().type(dataset).type('{downarrow}{enter}');
    } else if (master === 'child') {
      // No need to do uncheck the box, by default the box is not checked
      cy.get('[placeholder="Parent Scenario"]').click().clear().type(dataset);
    } else {
      cy.log('Unknown value. This function accept only "master" or "child" as values.');
    }
    // Validate the scenario creation
    cy.get('[data-cy="create-scenario-dialog-submit-button"]').click({ force: true });
    // Check the scenario is created
    cy.get('[placeholder="Scenario"]').should('have.attr', 'value', scenarioName);
  }

  // WARNING: for now, the function only manage unique names,
  // if the search function find two scenarios, it may cause an error
  // example: scenario 1 is named "Toto", scenario 2 is named "Toto2"
  // if you search for the first scenario "Toto", both scenario will be returned and the order may cause
  // the selection of the first scenario not beeing the one expected

  static searchScenario(scenarioName) {
    // Go to the scenario manager page
    connection.navigate('view');
    // Search for the correct scenario, select it with down arrow and type enter to validate.
    cy.get('[placeholder="Scenario"]').type(scenarioName).type('{downarrow}{enter}');
    // Check the correct scenario is diplayed
    cy.get('[placeholder="Scenario"]').should('have.attr', 'value', scenarioName);
  }

  static runScenario(scenarioName) {
    // Search the scenario
    this.searchScenario(scenarioName);
    // Run the scenario
    cy.get('[data-cy="launch-scenario-button"]').click();
    cy.wait(5000);
    // Wait until the end of the simulation (5 min timeout)
    cy.get('[data-cy="stop-scenario-run-button"]', { timeout: 300000 }).should('not.exist');
  }

  // Check if the simulation is successfull. Should already be in the correct scenario page.
  static simulationSuccess() {
    connection.navigate('dashboards');
    cy.get('[role="tabpanel"]').should('contain.text', 'Download logs');
  }

  // Check if the simulation is failed. Should already be in the correct scenario page.
  static simulationFail() {
    connection.navigate('dashboards');
    cy.get('[role="tabpanel"]').should('contain.text', 'Download logs');
  }

  // Start a simulation then cancel it
  static cancelRunSimulation(scenarioName) {
    // Search the scenario
    this.searchScenario(scenarioName);
    // Run the scenario
    cy.get('[data-cy="launch-scenario-button"]').click();
    // Wait 5 seconds
    cy.wait(5000);
    // Abort the simulation
    cy.get('[data-cy="stop-scenario-run-button"]').click();
    // Confirm abortion
    cy.get('[data-cy="cancel-run-button2"]').click();
    // Check it fails
    this.simulationFail();
  }
}

module.exports = Scenario;
