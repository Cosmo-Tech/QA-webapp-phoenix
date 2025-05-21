import 'cypress-file-upload';
const connection = require('../../../functions/connect.cy.js');
const datasetManager = require('../../../functions/datasetManager.cy.js');
const config = require('../../../../variables.cy.js');
const scenario = require('../../../functions/scenario.cy.js');

describe('Editable Tables Parameters', () => {
  it('Create a scenario that will be used for all the tests. Warning, if this creation fails, all tests will fail', () => {
    connection.connect();
    connection.navigate('scenario-view');

    // Clean in case it's a second try
    scenario.deleteScenario('DLOP-EditableTables');

    scenario.createScenario('DLOP-EditableTables', 'master', 'DLOP-Barcelona-for-automated-tests', 'MultipleParameters');
    scenario.shareScenarioWithUser('DLOP-EditableTables', config.permissionUserEmail(), config.permissionUserName(), 'admin');

    // No clean, as the scenario will be used in other tests
  });

  it('PROD-13697 and PROD-13905 -> Display node data (Customers table) and check data can be exported', () => {
    connection.connect();
    connection.navigate('scenario-view');

    // Search for the scenario
    scenario.searchScenarioInView('DLOP-EditableTables');

    // Select the "Customers" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="customers_tab"]').click();
    cy.wait(1000);

    // Check the table is not empty (check a name randomly)
    cy.get('[data-cy="table-initial_state"]').should('contain', 'Ainara_Manuel');

    // Download the data
    cy.get('[data-cy="export-button"]').eq(0).click();
    cy.get('[data-cy="table-export-file-confirm-button"]').click();

    // No clean as nothing has been created
  });

  it('PROD-13701 -> Display edge data (Satisfaction Network table)', () => {
    connection.connect();
    connection.navigate('scenario-view');

    // Search for the scenario
    scenario.searchScenarioInView('DLOP-EditableTables');

    // Select the "Satisfaction Network" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="cyphersatisfaction_tab"]').click();
    cy.wait(1000);

    // Check the table is not empty (check a name randomly)
    cy.get('[data-cy="table-satisfactionArc"]').should('contain', 'Casandra_Casado_Somoza');

    // Check the columns
    cy.get('[data-cy="table-satisfactionArc"]').should('contain', 'Source');
    cy.get('[data-cy="table-satisfactionArc"]').should('contain', 'Target');
    cy.get('[data-cy="table-satisfactionArc"]').should('contain', 'Name');

    // Select a line
    cy.contains('arc_from_Víctor_Gerardo_Ochoa_Palomo_to_Albina_Amor_Alegria').click();
    cy.wait(1000);

    // Check there is no "add line" or "delete line" button
    cy.get('[data-cy="add-row-button"]').should('not.exist');
    cy.get('[data-cy="delete-rows-button"]').should('not.exist');

    // No clean as nothing has been created
  });

  it('PROD-13800 -> Check imported tables (events table)', () => {
    connection.connect();
    connection.navigate('scenario-view');

    // Search for the scenario
    scenario.searchScenarioInView('DLOP-EditableTables');

    // Select the "Satisfaction Network" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="events_tab"]').click();
    cy.wait(1000);

    // Check the table is empty before any import
    cy.get('[data-cy="empty-table-placeholder"]').should('contain', 'Import your first data');
    cy.get('[data-cy="empty-table-placeholder"]').should('contain', 'After importing a valid csv or xlsx file, your data will be displayed in an interactive table.');

    // Import data
    cy.get('[data-cy="import-file-button"]').find('input').selectFile('cypress/fixtures/datasets/EditableTables/events.csv', { force: true });
    // Save imported data
    cy.get('[data-cy="save-button"]').click();
    cy.wait(1000);

    // Check the columns
    cy.get('[data-cy="table-events"]').should('contain', 'theme');
    cy.get('[data-cy="table-events"]').should('contain', 'date');
    cy.get('[data-cy="table-events"]').should('contain', 'timeOfDay');
    cy.get('[data-cy="table-events"]').should('contain', 'eventType');
    cy.get('[data-cy="table-events"]').should('contain', 'reservationsNumber');
    cy.get('[data-cy="table-events"]').should('contain', 'online');

    // Check the file imported with the correct data by checking randomly one event name
    cy.get('[data-cy="table-events"]').should('contain', 'asset Management');

    // Check there is no "add line" or "delete line" button
    cy.get('[data-cy="add-row-button"]').should('not.exist');
    cy.get('[data-cy="delete-rows-button"]').should('not.exist');

    // No clean as nothing has been created
  });

  it('PROD-13904 -> Modified tables are not updated when dataset is updated', () => {
    connection.connect();

    // Clean in case it's a second try
    datasetManager.deleteDataset('DLOP-PROD-13904-EditableTables');
    scenario.deleteScenario('DLOP-PROD-13904-EditableTables');

    // Create a dataset (it will be updated, so new dataset is better than using the global ones)
    connection.navigate('dataset');
    datasetManager.createDatasetLocalFile('DLOP-PROD-13904-EditableTables', 'A basic reference dataset for brewery model', 'reference');

    // Create a scenario
    scenario.createScenario('DLOP-PROD-13904-EditableTables', 'master', 'DLOP-PROD-13904-EditableTables', 'MultipleParameters');

    // Select the "Customer" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="customers_tab"]').click();
    cy.wait(1000);

    // Update a value and save
    cy.get('[data-cy="table-initial_state"]').contains('Customer1').dblclick().type('UpdatedCustomer1').type('{enter}');
    cy.wait(1000);
    cy.get('[data-cy="save-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="launch-scenario-button"]', { timeout: 10000 }).should('not.be.disabled');

    // Update the dataset with Barcelona dataset
    datasetManager.refreshDatasetFromFile('DLOP-PROD-13904-EditableTables', 'cypress/fixtures/datasets/barcelona.zip');

    // Return to the scenario and check the data have not been updated
    scenario.searchScenarioInView('DLOP-PROD-13904-EditableTables');

    // Select the "Customer" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="customers_tab"]').click();
    cy.wait(1000);

    // Check there is still "UpdatedCustomer1" value and no Barcelona value
    cy.get('[data-cy="table-initial_state"]').should('contain', 'UpdatedCustomer1');
    cy.get('[data-cy="table-initial_state"]').should('not.contain', 'Ainara_Manuel');

    // Clean the created dataset and scenario
    datasetManager.deleteDataset('DLOP-PROD-13904-EditableTables');
    scenario.deleteScenario('DLOP-PROD-13904-EditableTables');
  });

  it('PROD-13694 and PROD-13715 -> Add new row and default values', () => {
    connection.connect();
    connection.navigate('scenario-view');

    // Search for the scenario
    scenario.searchScenarioInView('DLOP-EditableTables');

    // Select the "Customer" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="customers_tab"]').click();
    cy.wait(1000);

    // Check the available icons for the table Additional customers
    cy.get('[data-cy="table-customers"]').find('[data-cy="grid-fullscreen-button"]').should('not.be.disabled');
    cy.get('[data-cy="table-customers"]').find('[data-cy="import-file-button"]').should('not.be.disabled');
    cy.get('[data-cy="table-customers"]').find('[data-cy="export-button"]').should('not.be.disabled');
    cy.get('[data-cy="table-customers"]').find('[data-cy="add-row-button"]').should('not.be.disabled');
    cy.get('[data-cy="table-customers"]').find('[data-cy="delete-rows-button"]').invoke('attr', 'aria-disabled').should('equal', 'true');

    // Create a line
    cy.get('[data-cy="table-customers"]').find('[data-cy="add-row-button"]').click();

    // Check line has been created, with default values prefilled
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="name"]').should('have.text', 'value');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="age"]').should('not.have.text');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="canDrinkAlcohol"]').should('have.text', 'false');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="favoriteDrink"]').should('have.text', 'Beer');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="birthday"]').should('not.have.text');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="height"]').should('not.have.text');

    // Select the line
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').click();

    // Delete icone should not be disabled, as a line is selected
    cy.get('[data-cy="table-customers"]').find('[data-cy="delete-rows-button"]').should('not.be.disabled');

    // Delete the line
    cy.get('[data-cy="table-customers"]').find('[data-cy="delete-rows-button"]').click();

    // Even if the line has been deleted, the table needs to be saved
    cy.get('[data-cy="save-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="launch-scenario-button"]', { timeout: 10000 }).should('not.be.disabled');

    // Nothing to clean
  });

  it('PROD-13792 -> Check labels are translated based on the defined language', () => {
    connection.connect();
    connection.navigate('scenario-view');

    // Search for the scenario
    scenario.searchScenarioInView('DLOP-EditableTables');

    // Check name of the tabs and the tables is the one defined in solution.json, in English

    // Select the "Customer" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="customers_tab"]').click();
    cy.wait(1000);

    // Check name of the tab and the tables
    cy.get('[data-cy="customers_tab"]').should('contain', 'Customers');
    cy.get('[data-cy="table-initial_state"]').should('contain', 'Initial state');
    cy.get('[data-cy="table-customers"]').should('contain', 'Additional Customers');

    // Select the "Events" tab of the parameters
    cy.get('[data-cy="events_tab"]').click();
    cy.wait(1000);

    // Check name of the tab and the tables
    cy.get('[data-cy="events_tab"]').should('contain', 'Events');
    cy.get('[data-cy="table-events"]').should('contain', 'Events');

    // Select the "Satisfaction Network" tab of the parameters
    cy.get('[data-cy="cyphersatisfaction_tab"]').click();
    cy.wait(1000);

    // Check name of the tab and the tables
    cy.get('[data-cy="cyphersatisfaction_tab"]').should('contain', 'Satisfaction network');
    cy.get('[data-cy="table-satisfactionArc"]').should('contain', 'Satisfaction network');

    // Now, do the same checks, but in French. Swich language.
    cy.get('[data-cy="user-profile-menu"]').click({ force: true });
    cy.get('[data-cy="change-language"]').click({ force: true });
    cy.get('[data-cy="set-lang-fr"]').click({ force: true });

    // Select the "Customer" tab of the parameters
    cy.get('[data-cy="customers_tab"]').click();
    cy.wait(1000);

    // Check name of the tab and the tables
    cy.get('[data-cy="customers_tab"]').should('contain', 'Clients');
    cy.get('[data-cy="table-initial_state"]').should('contain', 'Etat initial');
    cy.get('[data-cy="table-customers"]').should('contain', 'Clients Additionnels');

    // Select the "Events" tab of the parameters
    cy.get('[data-cy="events_tab"]').click();
    cy.wait(1000);

    // Check name of the tab and the tables
    cy.get('[data-cy="events_tab"]').should('contain', 'Évènements');
    cy.get('[data-cy="table-events"]').should('contain', 'Evénements');

    // Select the "Satisfaction Network" tab of the parameters
    cy.get('[data-cy="cyphersatisfaction_tab"]').click();
    cy.wait(1000);

    // Check name of the tab and the tables
    cy.get('[data-cy="cyphersatisfaction_tab"]').should('contain', 'Réseau de satisfaction');
    cy.get('[data-cy="table-satisfactionArc"]').should('contain', 'Réseau de satisfaction');

    // Nothing to clean
  });

  it('PROD-13729 -> Check the revert button', () => {
    connection.connect();
    connection.navigate('scenario-view');

    // Search for the scenario
    scenario.searchScenarioInView('DLOP-EditableTables');

    // Select the "Customer" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="customers_tab"]').click();
    cy.wait(1000);

    // Revert the table in case it's a second try
    cy.get('[data-cy="revert-table-button"]').click();
    cy.get('[data-cy="revert-table-data-dialog-confirm-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="save-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="launch-scenario-button"]', { timeout: 10000 }).should('not.be.disabled');

    // Update a name, then save
    cy.get('[data-cy="table-initial_state"]').contains('Lola_Gutierrez').dblclick().type('QA-Update').type('{enter}');
    cy.wait(1000);
    cy.get('[data-cy="save-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="launch-scenario-button"]', { timeout: 10000 }).should('not.be.disabled');

    // Check new name is displayed in the table
    cy.get('[data-cy="table-initial_state"]').should('contain', 'QA-Update');

    // Click on the "revert" button
    cy.get('[data-cy="revert-table-button"]').click();

    // Cancel revert
    cy.get('[data-cy="revert-table-data-dialog-cancel-button"]').click();

    // Check updated name is still in the table
    cy.get('[data-cy="table-initial_state"]').should('contain', 'QA-Update');

    // Revert and confirm
    cy.get('[data-cy="revert-table-button"]').click();
    cy.get('[data-cy="revert-table-data-dialog-confirm-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="save-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="launch-scenario-button"]', { timeout: 10000 }).should('not.be.disabled');

    // Check updated name is no longer in the table and the previous one is back
    cy.get('[data-cy="table-initial_state"]').should('not.contain', 'QA-Update');
    cy.get('[data-cy="table-initial_state"]').should('contain', 'Lola_Gutierrez');

    // Refrech the page
    cy.reload();
    scenario.searchScenarioInView('DLOP-EditableTables');
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="customers_tab"]').click();
    cy.wait(1000);

    // Check again the updated name is no longer in the table and the previous one is back
    cy.get('[data-cy="table-initial_state"]').should('not.contain', 'QA-Update');
    cy.get('[data-cy="table-initial_state"]').should('contain', 'Lola_Gutierrez');

    // Nothing to clean
  });

  it('PROD-13793 and PROD-13794 -> Parent/Child scenario and editable tables heritage', () => {
    connection.connect();

    // Clean in case it's a second try
    scenario.deleteScenario('DLOP-PROD-13793-Parent');
    scenario.deleteScenario('DLOP-PROD-13793-Child');
    scenario.deleteScenario('DLOP-PROD-13793-GrandChild');

    // Create scenario parent
    scenario.createScenario('DLOP-PROD-13793-Parent', 'master', 'DLOP-Reference-for-automated-tests', 'MultipleParameters');

    // Select the "Satisfaction Network" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="cyphersatisfaction_tab"]').click();
    cy.wait(1000);

    // Import data
    cy.get('[data-cy="import-file-button"]').find('input').selectFile('cypress/fixtures/datasets/EditableTables/satisfactionArc.csv', { force: true });
    // Save imported data
    cy.wait(1000);
    cy.get('[data-cy="save-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="launch-scenario-button"]', { timeout: 10000 }).should('not.be.disabled');

    // Check updated values are now displaying
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="source"]').should('have.text', 'UpdatedLine');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="target"]').should('have.text', 'NewLine');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="name"]').should('have.text', 'arc_to_Customer');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="1"]').find('[col-id="source"]').should('have.text', 'Customer1QA');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="3"]').find('[col-id="target"]').should('have.text', 'Customer4QA');

    // Select the "Customers" tab, then add a new line in the "Additional Customers" table.
    cy.get('[data-cy="customers_tab"]').click();
    cy.get('[data-cy="table-customers"]').find('[data-cy="add-row-button"]').click();
    // Save imported data
    cy.wait(1000);
    cy.get('[data-cy="save-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="launch-scenario-button"]', { timeout: 10000 }).should('not.be.disabled');
    cy.wait(3000);

    // Check line has been created, with default values prefilled
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="name"]').should('have.text', 'value');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="age"]').should('not.have.text');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="canDrinkAlcohol"]').should('have.text', 'false');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="favoriteDrink"]').should('have.text', 'Beer');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="birthday"]').should('not.have.text');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="height"]').should('not.have.text');
    // There is no revert button
    cy.get('[data-cy="table-customers"]').find('[data-cy="revert-table-button"]').should('not.exist');

    // Create child scenario
    scenario.createScenario('DLOP-PROD-13793-Child', 'child', 'DLOP-PROD-13793-Parent', 'MultipleParameters');

    // Select the "Satisfaction Network" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="cyphersatisfaction_tab"]').click();
    cy.wait(1000);

    // Check values in "Satisfaction Network" are the updated ones
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="source"]').should('have.text', 'UpdatedLine');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="target"]').should('have.text', 'NewLine');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="name"]').should('have.text', 'arc_to_Customer');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="1"]').find('[col-id="source"]').should('have.text', 'Customer1QA');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="3"]').find('[col-id="target"]').should('have.text', 'Customer4QA');

    // Select the "Customers" tab, then check default values are still in the new line of "Additional Customers" table.
    cy.get('[data-cy="customers_tab"]').click();
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="name"]').should('have.text', 'value');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="age"]').should('not.have.text');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="canDrinkAlcohol"]').should('have.text', 'false');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="favoriteDrink"]').should('have.text', 'Beer');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="birthday"]').should('not.have.text');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="height"]').should('not.have.text');
    // There is no revert button
    cy.get('[data-cy="table-customers"]').find('[data-cy="revert-table-button"]').should('not.exist');

    // Create a grand-child scenario
    scenario.createScenario('DLOP-PROD-13793-GrandChild', 'child', 'DLOP-PROD-13793-Child', 'MultipleParameters');

    // Select the "Satisfaction Network" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="cyphersatisfaction_tab"]').click();
    cy.wait(1000);

    // Check values in "Satisfaction Network" are the updated ones
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="source"]').should('have.text', 'UpdatedLine');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="target"]').should('have.text', 'NewLine');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="name"]').should('have.text', 'arc_to_Customer');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="1"]').find('[col-id="source"]').should('have.text', 'Customer1QA');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="3"]').find('[col-id="target"]').should('have.text', 'Customer4QA');

    // Select the "Customers" tab, then check default values are still in the new line of "Additional Customers" table.
    cy.get('[data-cy="customers_tab"]').click();
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="name"]').should('have.text', 'value');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="age"]').should('not.have.text');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="canDrinkAlcohol"]').should('have.text', 'false');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="favoriteDrink"]').should('have.text', 'Beer');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="birthday"]').should('not.have.text');
    cy.get('[data-cy="table-customers"]').find('[row-index="0"]').find('[col-id="height"]').should('not.have.text');
    // There is no revert button
    cy.get('[data-cy="table-customers"]').find('[data-cy="revert-table-button"]').should('not.exist');

    // Select child scenario
    scenario.searchScenarioInView('DLOP-PROD-13793-Child');

    // Select the "Satisfaction Network" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="cyphersatisfaction_tab"]').click();
    cy.wait(1000);

    // Revert the modification in this table
    cy.get('[data-cy="revert-table-button"]').click();
    cy.get('[data-cy="revert-table-data-dialog-confirm-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="save-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="launch-scenario-button"]', { timeout: 10000 }).should('not.be.disabled');
    cy.wait(3000);

    // Values are no longer the updated ones
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="source"]').should('not.have.text', 'UpdatedLine');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="target"]').should('not.have.text', 'NewLine');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="1"]').find('[col-id="source"]').should('not.have.text', 'Customer1QA');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="3"]').find('[col-id="target"]').should('not.have.text', 'Customer4QA');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="source"]').should('have.text', 'Customer1');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="target"]').should('have.text', 'Customer2');

    // Select GrandChild scenario
    scenario.searchScenarioInView('DLOP-PROD-13793-GrandChild');

    // Select the "Satisfaction Network" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="cyphersatisfaction_tab"]').click();
    cy.wait(1000);

    // Check values in "Satisfaction Network" are the updated ones
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="source"]').should('have.text', 'UpdatedLine');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="target"]').should('have.text', 'NewLine');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="name"]').should('have.text', 'arc_to_Customer');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="1"]').find('[col-id="source"]').should('have.text', 'Customer1QA');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="3"]').find('[col-id="target"]').should('have.text', 'Customer4QA');

    // Revert the modification in this table
    cy.get('[data-cy="revert-table-button"]').click();
    cy.get('[data-cy="revert-table-data-dialog-confirm-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="save-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="launch-scenario-button"]', { timeout: 10000 }).should('not.be.disabled');
    cy.wait(3000);

    // Values are no longer the updated ones
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="source"]').should('not.have.text', 'UpdatedLine');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="target"]').should('not.have.text', 'NewLine');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="1"]').find('[col-id="source"]').should('not.have.text', 'Customer1QA');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="3"]').find('[col-id="target"]').should('not.have.text', 'Customer4QA');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="source"]').should('have.text', 'Customer1');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="target"]').should('have.text', 'Customer2');

    // Select Parent scenario
    scenario.searchScenarioInView('DLOP-PROD-13793-Parent');

    // Select the "Satisfaction Network" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="cyphersatisfaction_tab"]').click();
    cy.wait(1000);

    // Check values in "Satisfaction Network" are the updated ones
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="source"]').should('have.text', 'UpdatedLine');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="target"]').should('have.text', 'NewLine');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="name"]').should('have.text', 'arc_to_Customer');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="1"]').find('[col-id="source"]').should('have.text', 'Customer1QA');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="3"]').find('[col-id="target"]').should('have.text', 'Customer4QA');

    // Revert the modification in this table
    cy.get('[data-cy="revert-table-button"]').click();
    cy.get('[data-cy="revert-table-data-dialog-confirm-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="save-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="launch-scenario-button"]', { timeout: 10000 }).should('not.be.disabled');
    cy.wait(3000);

    // Values are no longer the updated ones
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="source"]').should('not.have.text', 'UpdatedLine');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="target"]').should('not.have.text', 'NewLine');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="1"]').find('[col-id="source"]').should('not.have.text', 'Customer1QA');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="3"]').find('[col-id="target"]').should('not.have.text', 'Customer4QA');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="source"]').should('have.text', 'Customer1');
    cy.get('[data-cy="table-satisfactionArc"]').find('[row-id="0"]').find('[col-id="target"]').should('have.text', 'Customer2');

    // Clean the created scenarios
    scenario.deleteScenario('DLOP-PROD-13793-Parent');
    scenario.deleteScenario('DLOP-PROD-13793-Child');
    scenario.deleteScenario('DLOP-PROD-13793-GrandChild');
  });

  it('PROD-13717 -> Check error management (events table)', () => {
    connection.connect();
    connection.navigate('scenario-view');

    // Search for the scenario
    scenario.searchScenarioInView('DLOP-EditableTables');

    // Select the "Event" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="events_tab"]').click();
    cy.wait(1000);

    // Check an excel file can be uploaded with no error
    cy.get('[data-cy="import-file-button"]').find('input').selectFile('cypress/fixtures/datasets/EditableTables/PROD-13717-events_CorrectValues_excel.xlsx', { force: true });
    cy.get('[data-cy="errors-panel"]').should('not.exist');
    // Save imported data
    cy.wait(1000);
    cy.get('[data-cy="save-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="launch-scenario-button"]', { timeout: 10000 }).should('not.be.disabled');
    cy.wait(3000);

    // Check error management, import a file containing errors
    cy.get('[data-cy="import-file-button"]').find('input').selectFile('cypress/fixtures/datasets/EditableTables/PROD-13717-events_WrongValues_csv.csv', { force: true });
    cy.get('[data-cy="errors-panel"]').should('exist');
    cy.get('[data-cy="errors-header"]').should('contain', 'File load failed');
    cy.get('[data-cy="errors-header"]').should('contain', '10 errors occurred');

    cy.get('[data-cy="error-accordion-0"]').should('contain', 'Empty field');
    cy.get('[data-cy="error-accordion-0"]').should('contain', 'Line 2, Column 4 ("eventType")');

    cy.get('[data-cy="error-accordion-1"]').should('contain', 'Empty field');
    cy.get('[data-cy="error-accordion-1"]').should('contain', 'Line 2, Column 6 ("online")');

    cy.get('[data-cy="error-accordion-2"]').should('contain', 'Value out of range');
    cy.get('[data-cy="error-accordion-2"]').should('contain', 'Line 2, Column 2 ("date")');

    cy.get('[data-cy="error-accordion-3"]').should('contain', 'Incorrect enum value');
    cy.get('[data-cy="error-accordion-3"]').should('contain', 'Line 2, Column 3 ("timeOfDay")');

    cy.get('[data-cy="error-accordion-4"]').should('contain', 'Value out of range');
    cy.get('[data-cy="error-accordion-4"]').should('contain', 'Line 2, Column 5 ("reservationsNumber")');

    cy.get('[data-cy="error-accordion-5"]').should('contain', 'Empty field');
    cy.get('[data-cy="error-accordion-5"]').should('contain', 'Line 3, Column 3 ("timeOfDay")');

    cy.get('[data-cy="error-accordion-6"]').should('contain', 'Value out of range');
    cy.get('[data-cy="error-accordion-6"]').should('contain', 'Line 3, Column 2 ("date")');

    cy.get('[data-cy="error-accordion-7"]').should('contain', 'Value out of range');
    cy.get('[data-cy="error-accordion-7"]').should('contain', 'Line 3, Column 5 ("reservationsNumber")');

    cy.get('[data-cy="error-accordion-8"]').should('contain', 'Incorrect bool value');
    cy.get('[data-cy="error-accordion-8"]').should('contain', 'Line 3, Column 6 ("online")');

    cy.get('[data-cy="error-accordion-9"]').should('contain', 'Empty field');
    cy.get('[data-cy="error-accordion-9"]').should('contain', 'Line 4, Column 2 ("date")');

    // Save imported data (even if wrong file has been imported and so it's not replacing the table, a save is needed)
    cy.wait(1000);
    cy.get('[data-cy="save-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="launch-scenario-button"]', { timeout: 10000 }).should('not.be.disabled');
    cy.wait(3000);

    // Nothing to clean
  });

  it('PROD-13707 -> Empty fields (events table)', () => {
    connection.connect();
    connection.navigate('scenario-view');

    // Search for the scenario
    scenario.searchScenarioInView('DLOP-EditableTables');

    // Select the "Event" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="events_tab"]').click();
    cy.wait(1000);

    // Try to empty a cell in a column set to "acceptsEmptyFields=false" in Solution.json
    cy.get('[data-cy="table-events"]').find('[row-index="0"]').find('[col-id="theme"]').dblclick().type('{backspace}').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-events"]').find('[row-index="0"]').find('[col-id="theme"]').should('have.text', 'complex systems');

    // Empty a cell in a column set to "acceptsEmptyFields=true" in Solution.json
    cy.get('[data-cy="table-events"]').find('[row-index="0"]').find('[col-id="reservationsNumber"]').dblclick().type('{backspace}').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-events"]').find('[row-index="0"]').find('[col-id="reservationsNumber"]').should('not.have.text');

    // Discard modifications, so the table will be on the same state than before the test
    cy.wait(1000);
    cy.get('[data-cy="discard-button"]').click();
    cy.get('[id="discard-changesid-button2"]').click();
    cy.wait(1000);
    cy.get('[data-cy="launch-scenario-button"]', { timeout: 10000 }).should('not.be.disabled');

    // Nothing to clean
  });

  it('PROD-13707 -> Boolean column checks', () => {
    connection.connect();
    connection.navigate('scenario-view');

    // Search for the scenario
    scenario.searchScenarioInView('DLOP-EditableTables');

    // Select the "Customers" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="customers_tab"]').click();
    cy.wait(1000);

    // Update a value in the column "Thirsty" of the table "Initial State".
    // The column accept only boolean and will so come back to the previous valid value in case of wrong value.
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="thirsty"]').dblclick().type('4').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="thirsty"]').should('have.text', 'false');

    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="thirsty"]').dblclick().type('String').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="thirsty"]').should('have.text', 'false');

    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="thirsty"]').dblclick().type('true').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="thirsty"]').should('have.text', 'true');

    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="thirsty"]').dblclick().type('false').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="thirsty"]').should('have.text', 'false');

    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="thirsty"]').dblclick().type('yes').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="thirsty"]').should('have.text', 'true');

    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="thirsty"]').dblclick().type('no').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="thirsty"]').should('have.text', 'false');

    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="thirsty"]').dblclick().type('1').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="thirsty"]').should('have.text', 'true');

    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="thirsty"]').dblclick().type('0').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="thirsty"]').should('have.text', 'false');

    // Discard modifications, so the table will be on the same state than before the test
    cy.wait(1000);
    cy.get('[data-cy="discard-button"]').click();
    cy.get('[id="discard-changesid-button2"]').click();
    cy.wait(1000);
    cy.get('[data-cy="launch-scenario-button"]', { timeout: 10000 }).should('not.be.disabled');

    // Nothing to clean
  });

  it('PROD-13705 -> Integer column checks', () => {
    connection.connect();
    connection.navigate('scenario-view');

    // Search for the scenario
    scenario.searchScenarioInView('DLOP-EditableTables');

    // Select the "Customers" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="customers_tab"]').click();
    cy.wait(1000);

    // Update a value in the column "Satisfaction" of the table "Initial State".
    // The column accept only integer between 0 and 10 and will so come back to the previous valid value or the closest valid value in case of wrong value.
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="satisfaction"]').dblclick().type('11').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="satisfaction"]').should('have.text', '10');

    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="satisfaction"]').dblclick().type('-1').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="satisfaction"]').should('have.text', '0');

    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="satisfaction"]').dblclick().type('A4').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="satisfaction"]').should('have.text', '0');

    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="satisfaction"]').dblclick().type('5.4').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="satisfaction"]').should('have.text', '5');

    // Discard modifications, so the table will be on the same state than before the test
    cy.wait(1000);
    cy.get('[data-cy="discard-button"]').click();
    cy.get('[id="discard-changesid-button2"]').click();
    cy.wait(1000);
    cy.get('[data-cy="launch-scenario-button"]', { timeout: 10000 }).should('not.be.disabled');

    // Nothing to clean
  });

  it('PROD-13706 -> String column checks', () => {
    connection.connect();
    connection.navigate('scenario-view');

    // Search for the scenario
    scenario.searchScenarioInView('DLOP-EditableTables');

    // Select the "Customers" tab of the parameters
    cy.get('[data-cy="scenario-params-accordion-summary"]')
      .invoke('attr', 'aria-expanded')
      .then(($folded) => {
        if ($folded === 'false') {
          cy.get('[data-cy="scenario-params-accordion-summary"]').click();
        }
      });
    cy.get('[data-cy="customers_tab"]').click();
    cy.wait(1000);

    // Update a value in the column "Satisfaction" of the table "Initial State".
    // The column accept only integer between 0 and 10 and will so come back to the previous valid value or the closest valid value in case of wrong value.
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="name"]').dblclick().type('=&²"# {([|è``ç^à').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="name"]').should('have.text', '=&²"# {([|è``ç^à');

    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="name"]').dblclick().type('@)]}<>/+$£').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="name"]').should('have.text', '@)]}<>/+$£');

    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="name"]').dblclick().type('ö_µù%§.').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="name"]').should('have.text', 'ö_µù%§.');

    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="name"]').dblclick().type('Virgina Wolf').type('{enter}');
    cy.wait(500);
    cy.get('[data-cy="table-initial_state"]').find('[row-index="0"]').find('[col-id="name"]').should('have.text', 'Virgina Wolf');

    // Discard modifications, so the table will be on the same state than before the test
    cy.wait(1000);
    cy.get('[data-cy="discard-button"]').click();
    cy.get('[id="discard-changesid-button2"]').click();
    cy.wait(1000);
    cy.get('[data-cy="launch-scenario-button"]', { timeout: 10000 }).should('not.be.disabled');

    // Nothing to clean
  });
});
