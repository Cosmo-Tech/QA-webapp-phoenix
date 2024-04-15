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
    cy.contains('Account name').click({ force: true }).type(accountName, { force: true });
    cy.contains('Container name').click({ force: true }).type(containerName, { force: true });
    cy.contains('Path').click({ force: true }).type(datasetPath, { force: true });
    // Confirm the creation
    cy.get('[data-cy="confirm-dataset-creation"]').click();
    // Check dataset is created
    cy.get('[data-cy="datasets-list"]').should('contain', datasetName);
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
    cy.get('[data-cy="dataset-overview-title"]', { timeout: 60000 }).should('not.contain', 'Importing your data, please wait...', { timeout: 60000 });
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
        cy.log('The dataset does not exist and, indeed, can not be selected');
      }
    });
  }

  static deleteDataset(datasetName) {
    this.searchDataset(datasetName);
    cy.get('[data-cy="datasets-list"]').then(($ele) => {
      cy.wait(500);
      if ($ele.find('[data-cy^="datasets-list-item-button-"]').length === 1) {
        cy.get('[data-testid="DeleteForeverIcon"]').first().click();
        cy.get('[data-cy="delete-dataset-button2"]').click();
        cy.wait(500);
      } else {
        cy.log('The dataset does not exist and, indeed, can not be deleted');
      }
    });
    this.clearSearch();
  }
}

module.exports = datasetManager;
