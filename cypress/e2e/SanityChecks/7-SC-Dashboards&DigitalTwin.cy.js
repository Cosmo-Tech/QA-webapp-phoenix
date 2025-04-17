import 'cypress-file-upload';
var connection = require('../../functions/connect.cy.js');
var datasetManager = require('../../functions/datasetManager.cy.js');
var config = require('../../../variables.cy.js');
var scenario = require('../../functions/scenario.cy.js');

describe('Dashboards and Digital Twin features', () => {
  it('PROD-13750: Scenario not run yet', () => {
    connection.connect();
    // Delete scenarios in case it's a second try
    scenario.deleteScenario('PROD-13750-DashboardsChecks-NoRun');
    scenario.deleteScenario('PROD-13750-DashboardsChecks-Run');

    // Create and run the needed scenarios
    connection.navigate('scenario-view');
    scenario.createScenario('PROD-13750-DashboardsChecks-NoRun', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');
    scenario.createScenario('PROD-13750-DashboardsChecks-Run', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');
    scenario.runScenario('PROD-13750-DashboardsChecks-Run');
    scenario.shareScenarioWithUser('PROD-13750-DashboardsChecks-Run', config.permissionUserEmail(), config.permissionUserName(), 'admin');

    // Select the scenario that has not run
    scenario.searchScenarioInView('PROD-13750-DashboardsChecks-NoRun');
    connection.navigate('dashboards');

    // Only available for Brewery - Check the powerBI sections and click on one section
    cy.get('[aria-label="Dashboards list"]').should('contain', 'Digital Twin Structure');
    cy.get('[aria-label="Dashboards list"]').should('contain', 'Stocks Follow-up');
    cy.get('[aria-label="Dashboards list"]').should('contain', 'Customer Satisfaction');
    cy.contains('Stocks Follow-up').click();

    // Check the "no scenario" message displays and no graph displays
    cy.get('[data-cy="dashboard-placeholder"]').should('have.text', 'The scenario has not been run yet');
    cy.get('[data-testid="display-area"]').should('not.exist');

    // Clean the scenario not used in manual test
    scenario.deleteScenario('PROD-13750-DashboardsChecks-NoRun');
  });

  it('PROD-13751: Digital Twin', () => {
    connection.connect();
    // Delete scenarios in case it's a second try
    scenario.deleteScenario('PROD-13751-DigitalTwin');

    // Create the needed scenarios
    connection.navigate('scenario-view');
    scenario.createScenario('PROD-13751-DigitalTwin', 'master', 'DLOP-Reference-for-automated-tests', 'BreweryParameters');
    scenario.shareScenarioWithUser('PROD-13751-DigitalTwin', config.permissionUserEmail(), config.permissionUserName(), 'admin');

    // Go to Digital Twin section
    connection.navigate('digital-twin');
    cy.get('[data-testid="ChevronRightIcon"]', { timeout: 60000 }).click();
    // Expand all sections
    cy.get('[data-testid="ExpandMoreIcon"]').click({ multiple: true });
    cy.get('[data-cy="cytoviz-drawer-details-tab-button"]').should('exist');
    cy.get('[data-cy="cytoviz-drawer-details-tab-content"]').should('contain', 'Node details');
    cy.get('[data-cy="cytoviz-drawer-details-tab-content"]').should('contain', 'Find a node');
    cy.get('[data-cy="cytoviz-drawer-details-tab-content"]').should('contain', 'Explore a subgraph');
    cy.get('[data-cy="cytoviz-drawer-details-tab-content"]').should('contain', 'Select a node or edge to show its data');

    // Check 'find a node' part - Don't work, is checked manually
    //cy.contains('Find a node').find('[role="combobox"]').type('Customer4{downarrow}{enter}');

    // Check 'Explore a subgraph' part
    cy.get('[id="exploreGraphPanel-content"]').should('contain', 'Select the starting node(s)');
    cy.get('[id="exploreGraphPanel-content"]').should('contain', 'Exclude relation types');
    cy.get('[id="exploreGraphPanel-content"]').should('contain', 'Limit the search depth');
    cy.get('[id="exploreGraphPanel-content"]').should('contain', 'Choose the flow direction');
    cy.get('[id="exploreGraphPanel-content"]').should('contain', 'Include the other entities of a compound');
    cy.get('[id="exploreGraphPanel-content"]').find('[role="combobox"]').should('exist');
    cy.contains('Limit the search depth').find('[type="number"]').invoke('attr', 'value').should('eq', '10');
    cy.get('[data-testid="CheckBoxOutlineBlankIcon"]').should('exist');
    cy.get('[data-testid="CheckBoxIcon"]').should('exist');
    cy.get('[id="exploreGraphPanel-content"]').should('contain', 'IN-Edges');
    cy.get('[id="exploreGraphPanel-content"]').should('contain', 'OUT-Edges');
    cy.get('[id="exploreGraphPanel-content"]').find('button').should('contain', 'Explore');
    cy.get('[id="exploreGraphPanel-content"]').find('button').should('not.be.disabled');

    // Try wrong 'limit of search' values
    cy.contains('Limit the search depth').find('[type="number"]').clear();
    cy.get('[id$="-helper-text"]').should('have.text', 'Enter a positive integer');
    cy.get('[id="exploreGraphPanel-content"]').find('button').should('be.disabled');
    cy.contains('Limit the search depth').find('[type="number"]').clear().type('aaa');
    cy.get('[id$="-helper-text"]').should('have.text', 'Enter a positive integer');
    cy.get('[id="exploreGraphPanel-content"]').find('button').should('be.disabled');
    cy.contains('Limit the search depth').find('[type="number"]').clear().type('-3');
    cy.get('[id$="-helper-text"]').should('have.text', 'Enter a positive integer');
    cy.get('[id="exploreGraphPanel-content"]').find('button').should('be.disabled');

    // Accepted 'limit of search' values
    cy.contains('Limit the search depth').find('[type="number"]').clear().type('0');
    cy.get('[id="exploreGraphPanel-content"]').find('button').should('not.be.disabled');
    cy.contains('Limit the search depth').find('[type="number"]').clear().type('1,1');
    cy.get('[id="exploreGraphPanel-content"]').find('button').should('not.be.disabled');
    cy.contains('Limit the search depth').find('[type="number"]').clear().type('150000');
    cy.get('[id="exploreGraphPanel-content"]').find('button').should('not.be.disabled');

    // Uncheck all "Choose the flow direction" checkboxes then check the two boxes
    cy.get('[aria-label="OUT-Edges"]').find('input').click({ force: true });
    cy.get('[id="exploreGraphPanel-content"]').should('contain', 'Select at least one');
    cy.get('[id="exploreGraphPanel-content"]').find('button').should('be.disabled');
    cy.get('[aria-label="OUT-Edges"]').find('input').click({ force: true });
    cy.get('[aria-label="IN-Edges"]').find('input').click({ force: true });
    cy.get('[id="exploreGraphPanel-content"]').find('button').should('not.be.disabled');

    // Check the settings
    cy.get('[data-cy="cytoviz-drawer-settings-tab-button"]').click();
    cy.get('[data-cy="cytoviz-drawer-settings-tab-content"]').should('contain', 'Layout');
    cy.get('[data-cy="cytoviz-drawer-settings-tab-content"]').should('contain', 'Compact layout');
    cy.get('[data-cy="cytoviz-drawer-settings-tab-content"]').should('contain', 'Cytoscape statistics');
    cy.get('[data-cy="cytoviz-drawer-settings-tab-content"]').should('contain', 'Spacing factor');
    cy.get('[data-cy="cytoviz-drawer-settings-tab-content"]').should('contain', 'Min & max zoom');
    cy.get('[data-cy="cytoviz-layout-selector"]').find('input').invoke('attr', 'value').should('eq', 'breadthfirst');
    cy.get('[name="useCompactMode"]').should('exist');
    cy.get('[name="showStats"]').should('exist');
    cy.get('[data-cy="cytoviz-spacing-factor-slider"]').should('exist');
    cy.get('[data-cy="cytoviz-zoom-limits-slider"]').should('exist');
  });
});
