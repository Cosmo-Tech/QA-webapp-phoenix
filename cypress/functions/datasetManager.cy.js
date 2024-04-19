const { da } = require('date-fns/locale');

class datasetManager {
  //This function create a dataset with the source "Local File". It requires the local file to be in the Fixtures > Datasets folder.

  static createDatasetLocalFile(datasetName, description, fileName) {
    // Before creation, check if there is no dataset yet existing with the same name, and if so, delete the existing dataset
    this.deleteDataset(datasetName);

    // Create a new dataset
    cy.get('[data-testid="AddIcon"]', { timeout: 60000 }).click();
    // Check the creation wizard text
    cy.get('[role="dialog"]').should('contain', 'Create dataset');
    cy.get('[role="dialog"]').should('contain', 'Metadata');
    cy.get('[role="dialog"]').should('contain', 'Dataset source type');
    cy.get('[role="dialog"]').should('contain', 'Please provide some metadata regarding your new dataset');
    cy.get('[role="dialog"]').should('contain', 'Name');
    cy.get('[role="dialog"]').should('contain', 'Tags');
    cy.get('[role="dialog"]').should('contain', 'Description');
    // Enter the name of the dataset
    cy.get('[data-cy="text-input-new-dataset-title"]').click().type(datasetName);
    // Enter the tags
    cy.get('#new-dataset-tags').click().type('localFile').type('{enter}');
    // Enter the description
    cy.get('[data-cy="text-input-new-dataset-description"]').click().type(description);
    // Go to next step
    cy.get('[data-cy=dataset-creation-next-step]').click();

    // Check the creation wizard text
    cy.get('[role="dialog"]').should('contain', 'Create dataset');
    cy.get('[role="dialog"]').should('contain', 'Metadata');
    cy.get('[role="dialog"]').should('contain', 'Dataset source type');
    cy.get('[role="dialog"]').should('contain', 'Please provide your data source');
    cy.get('[role="dialog"]').should('contain', 'Source');
    // Select the source
    cy.get('[data-cy="enum-input-select-new-dataset-sourceType"]').click();
    cy.get('[data-cy=enum-input-value-tooltip-File]').click();
    // Check the browse button is available
    cy.get('[data-cy=browse-button]').should('exist');
    // Browse the dataset
    var datasetPath = 'cypress/fixtures/datasets/' + fileName + '.zip';
    cy.get('[data-cy=browse-button]').selectFile(datasetPath, { force: true });
    cy.wait(1000);
    // Confirm the creation
    cy.get('[data-cy="confirm-dataset-creation"]').click();
    // Check dataset is created
    cy.get('[data-cy="datasets-list"]').should('contain', datasetName);
    cy.get('[data-cy*="dataset-reupload-button-"]', { timeout: 60000 }).should('exist', { timeout: 60000 });
  }

  static createDatasetAzureStorage(datasetName, description, accountName, containerName, datasetPath) {
    // Before creation, check if there is no dataset yet existing with the same name, and if so, delete the existing dataset
    this.deleteDataset(datasetName);

    // Create a new dataset
    cy.get('[data-testid="AddIcon"]', { timeout: 60000 }).click();
    // Check the creation wizard text
    cy.get('[role="dialog"]').should('contain', 'Create dataset');
    cy.get('[role="dialog"]').should('contain', 'Metadata');
    cy.get('[role="dialog"]').should('contain', 'Dataset source type');
    cy.get('[role="dialog"]').should('contain', 'Please provide some metadata regarding your new dataset');
    cy.get('[role="dialog"]').should('contain', 'Name');
    cy.get('[role="dialog"]').should('contain', 'Tags');
    cy.get('[role="dialog"]').should('contain', 'Description');
    // Enter the name of the dataset
    cy.get('[data-cy="text-input-new-dataset-title"]').click().type(datasetName);
    // Enter the tags
    cy.get('#new-dataset-tags').click().type('AzureStorage').type('{enter}');
    // Enter the description
    cy.get('[data-cy="text-input-new-dataset-description"]').click().type(description);
    // Go to next step
    cy.get('[data-cy=dataset-creation-next-step]').click();

    // Check the creation wizard text
    cy.get('[role="dialog"]').should('contain', 'Create dataset');
    cy.get('[role="dialog"]').should('contain', 'Metadata');
    cy.get('[role="dialog"]').should('contain', 'Dataset source type');
    cy.get('[role="dialog"]').should('contain', 'Please provide your data source');
    cy.get('[role="dialog"]').should('contain', 'Source');
    // Select the source
    cy.get('[data-cy="enum-input-select-new-dataset-sourceType"]').click();
    cy.get('[data-cy=enum-input-value-tooltip-AzureStorage]').click();
    // Enter the requested information
    var informationIndex = 1;
    cy.get('input[id^="mui-"]').each(($el) => {
      cy.log('informationIndex avant = ' + informationIndex);
      if (informationIndex === 1) {
        var informationTexte = accountName;
      } else if (informationIndex === 2) {
        var informationTexte = containerName;
      } else if (informationIndex === 3) {
        var informationTexte = datasetPath;
      }
      cy.get($el).click({ force: true }).type(informationTexte, { force: true });
      //cy.wrap($el).find('input').click({ force: true }).type(informationTexte, { force: true });
      informationIndex = informationIndex + 1;
      cy.log('informationIndex après = ' + informationIndex);
    });

    //cy.contains('Account name').click({ force: true }).type(accountName, { force: true });
    //cy.contains('Container name').click({ force: true }).type(containerName, { force: true });
    //cy.contains('Path').click({ force: true }).type(datasetPath, { force: true });
    // Confirm the creation
    cy.get('[data-cy="confirm-dataset-creation"]').click();
    // Check dataset is created
    cy.get('[data-cy="datasets-list"]').should('contain', datasetName);
    cy.get('[data-cy*="dataset-refresh-button-"]', { timeout: 60000 }).should('exist', { timeout: 60000 });
  }

  static createDatasetADT(datasetName, description, datasetPath) {
    // Before creation, check if there is no dataset yet existing with the same name, and if so, delete the existing dataset
    this.deleteDataset(datasetName);

    // Create a new dataset
    cy.get('[data-testid="AddIcon"]', { timeout: 60000 }).click();
    // Check the creation wizard text
    cy.get('[role="dialog"]').should('contain', 'Create dataset');
    cy.get('[role="dialog"]').should('contain', 'Metadata');
    cy.get('[role="dialog"]').should('contain', 'Dataset source type');
    cy.get('[role="dialog"]').should('contain', 'Please provide some metadata regarding your new dataset');
    cy.get('[role="dialog"]').should('contain', 'Name');
    cy.get('[role="dialog"]').should('contain', 'Tags');
    cy.get('[role="dialog"]').should('contain', 'Description');
    // Enter the name of the dataset
    cy.get('[data-cy="text-input-new-dataset-title"]').click().type(datasetName);
    // Enter the tags
    cy.get('#new-dataset-tags').click().type('ADT').type('{enter}');
    // Enter the description
    cy.get('[data-cy="text-input-new-dataset-description"]').click().type(description);
    // Go to next step
    cy.get('[data-cy=dataset-creation-next-step]').click();

    // Check the creation wizard text
    cy.get('[role="dialog"]').should('contain', 'Create dataset');
    cy.get('[role="dialog"]').should('contain', 'Metadata');
    cy.get('[role="dialog"]').should('contain', 'Dataset source type');
    cy.get('[role="dialog"]').should('contain', 'Please provide your data source');
    cy.get('[role="dialog"]').should('contain', 'Source');
    // Select the source
    cy.get('[data-cy="enum-input-select-new-dataset-sourceType"]').click();
    cy.get('[data-cy=enum-input-value-tooltip-ADT]').click();
    // Enter the requested information
    cy.get('input[id^="mui-"]').click({ force: true }).type(datasetPath, { force: true });
    // Confirm the creation
    cy.get('[data-cy="confirm-dataset-creation"]').click();
    // Check dataset is created
    cy.get('[data-cy="datasets-list"]').should('contain', datasetName);
    cy.get('[data-cy*="dataset-refresh-button-"]', { timeout: 60000 }).should('exist', { timeout: 60000 });
  }

  // Only working with the example ETL done by Tristan. If the ETL is updated, the test will need to be updated after the "TO UPDATE IF ETL CHANGE" section.
  // Filter can currently accept only two options: "Thirsty" and "Not thirsty"
  static createSubDataset(parentName, datasetName, description, filter) {
    // Before creation, check if there is no dataset yet existing with the same name, and if so, delete the existing dataset
    this.deleteDataset(datasetName);
    this.selectDataset(parentName);
    // Create a new dataset
    cy.get('[data-cy="create-subdataset-button"]').click();
    // Check the creation wizard text
    cy.get('[role="dialog"]').should('contain', 'Create sub dataset');
    cy.get('[role="dialog"]').should('contain', 'Metadata');
    //cy.get('[role="dialog"]').should('contain', 'Filter');
    cy.get('[role="dialog"]').should('contain', 'Please provide some metadata regarding your new dataset');
    cy.get('[role="dialog"]').should('contain', 'Parent dataset');
    cy.get('[role="dialog"]').should('contain', parentName);
    cy.get('[role="dialog"]').should('contain', 'Name');
    cy.get('[role="dialog"]').should('contain', 'Tags');
    cy.get('[role="dialog"]').should('contain', 'Description');
    // Enter the new metadata of the dataset
    cy.get('input[id^="mui-"]').clear({ force: true }).type(datasetName, { force: true });
    cy.get('[role="dialog"').find('[data-testid="CancelIcon"]').click({force: true});
    cy.get('[role="dialog"').find('#new-dataset-tags').click().type('Subdataset').type('{enter}');
    cy.get('textarea[id^="mui-"]').clear({ force: true }).type(description, { force: true });
    // Go to next step
    cy.get('[data-cy=dataset-creation-next-step]').click();
    
    // Check the creation wizard text
    cy.get('[role="dialog"]').should('contain', 'Create sub dataset');
    cy.get('[role="dialog"]').should('contain', 'Metadata');
    //cy.get('[role="dialog"]').should('contain', 'Filter');
    //cy.get('[role="dialog"]').should('contain', 'Please select your filter');
    //cy.get('[role="dialog"]').should('contain', 'Filter');

    // TO UPDATE IF ETL CHANGE
    // Select the filter
    cy.get('[data-cy="enum-input-select-etl_param_subdataset_filter_is_thirsty"]').click();
    cy.contains(filter).click({force:true});
    // END OF UPTADE

    // Confirm the creation
    cy.get('[data-cy="confirm-dataset-creation"]').click({force:true});
    cy.wait(5000);
    // Check dataset is created
    cy.get('[data-cy="datasets-list"]').should('contain', datasetName);
    cy.get('[data-cy="dataset-overview-abort-button"]', { timeout: 60000 }).should('not.exist', { timeout: 60000 });
    this.clearSearch();

  }

  static searchDataset(datasetName) {
    cy.get('#dataset-search-bar', { timeout: 60000 }).click().type(datasetName);
    cy.wait(500);
  }

  static clearSearch() {
    cy.get('#dataset-search-bar', { timeout: 60000 }).clear();
    cy.wait(500);
  }

  static selectDataset(datasetName) {
    this.searchDataset(datasetName);
    cy.get('[data-cy="datasets-list"]').then(($ele) => {
      cy.wait(500);
      if ($ele.find('[data-cy^="datasets-list-item-button-"]').length === 1) {
        cy.get('[data-cy^="datasets-list-item-button-"]').click();
        cy.wait(500);
      } else {
        cy.log('The dataset does not exist or is not the only one found and, indeed, can not be selected');
      }
    });
  }

  static deleteDataset(datasetName) {
    this.searchDataset(datasetName);
    cy.wait(1000);
    cy.get('[data-cy="datasets-list"]').then(($ele) => {
      cy.wait(500);
      if ($ele.find('[data-cy^="datasets-list-item-button-"]').length === 1) {
        cy.get('[data-testid="DeleteForeverIcon"]').first().click({ force: true });
        cy.get('[data-cy="delete-dataset-button2"]').click();
        cy.wait(500);
      } else {
        cy.log('The dataset does not exist and, indeed, can not be deleted');
      }
    });
    this.clearSearch();
  }

  static overviewDataet(datasetName) {
    this.selectDataset(datasetName);
    // Check dataset name is present
    cy.get('[data-cy="dataset-name"]').should('contain', datasetName);
    // Check the layout icons
    cy.get('[data-testid="RefreshIcon"]').should('exist');
    cy.get('[data-cy="create-subdataset-button"]').should('exist');
    cy.get('[data-testid="ShareIcon"]').should('exist');
    cy.get('[data-testid="DeleteForeverIcon"').should('exist');
    // Check there is no error in the cards
    cy.get('[aria-label="The query to fetch this indicator has failed"]').should('not.exist');
    cy.get('[data-testid="ErrorIcon"]').should('not.exist');
    // Check the 4 cards are displayed
    cy.get('[data-cy="indicator-card-bars_count"]').should('exist');
    cy.get('[data-cy="indicator-card-customers_count"]').should('exist');
    cy.get('[data-cy="indicator-card-satisfaction_links_count"]').should('exist');
    cy.get('[data-cy="indicator-card-relationships_count"]').should('exist');
    // Check the details are folded by default
    cy.get('[class*="MuiCollapse-hidden"]').should('exist');
    // Check the details can be unfolded
    cy.get('[data-testid="ExpandMoreIcon"]').click({ multiple: true });
    cy.get('[class*="MuiCollapse-entered"]').should('exist');
    // Check the details are presents (partial checks, not everything is checked);
    cy.get('[data-cy="dataset-overview-card"').contains('Bars are compound entities in the Brewery model. They are responsible of the stock management and the number of waiters.');
    cy.get('[data-cy="dataset-overview-card"').contains('An entity of type Bar is the parent entity of Customers inside this bar.');
    cy.get('[data-cy="dataset-overview-card"').contains('Average stock');
    cy.get('[data-cy="dataset-overview-card"').contains('Average waiters');
    cy.get('[data-cy="dataset-overview-card"').contains('Min. waiters');
    cy.get('[data-cy="dataset-overview-card"').contains('Max. waiters');
    cy.get('[data-cy="dataset-overview-card"').contains('Attributes');
    cy.get('[data-cy="dataset-overview-card"').contains('NbWaiters, RestockQty, Stock');
    cy.get('[data-cy="dataset-overview-card"').contains('Customers are basic entities in the Brewery model. They are used to simulate beverage consumption inside Bar entities, with an influence graph between customers');
    cy.get('[data-cy="dataset-overview-card"').contains('Average satisfaction');
    cy.get('[data-cy="dataset-overview-card"').contains('Satisfaction, SurroundingSatisfaction, Thirsty');
    // Check the details can be folded again
    cy.get('[data-testid="ExpandMoreIcon"]').click({ multiple: true });
    cy.get('[class*="MuiCollapse-hidden"]').should('exist');
    // Clear the search to have all the dataset list back
    this.clearSearch();
  }
}

module.exports = datasetManager;
