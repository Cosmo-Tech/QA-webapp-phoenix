import 'cypress-file-upload';
const connection = require('../../../functions/connect.cy.js');
const datasetManager = require('../../../functions/datasetManager.cy.js');
const config = require('../../../../variables.cy.js');
const scenario = require('../../../functions/scenario.cy.js');

describe('Editable Tables Parameters', () => {
  it('PROD-13888: Check overview detail table', () => {
    connection.connect();

    // Remove in case it's a second try
    datasetManager.deleteDataset('DLOP-PROD-13888-CheckOverview');

    datasetManager.createDatasetLocalFile('DLOP-PROD-13888-CheckOverview', 'A dataset to check the overview details', 'reference');
    datasetManager.shareDatasetUser('DLOP-PROD-13888-CheckOverview', config.permissionUserEmail(), config.permissionUserName(), 'admin');

    // Open the details for customers. Have to force to click on the second button, as all buttons for details have the same id.
    cy.get('[data-cy="category-accordion-summary-customers"]').click();
    cy.get('[data-cy="category-details-dialog-open-button"]').eq(1).click();
    cy.wait(1000);
    // Check 4 colonnes
    cy.get('[role="treegrid"]').invoke('attr', 'aria-colcount').should('eq', '4');
    // Check 4 customers + headers = 5 lignes
    cy.get('[role="treegrid"]').invoke('attr', 'aria-rowcount').should('eq', '5');
    // Check you can switch to full screen
    cy.get('[data-cy="grid-fullscreen-button"]').should('not.be.disabled');
    // Check you can download the data
    cy.get('[data-cy="export-button"]').should('not.be.disabled');
    // Close the details
    cy.get('[data-cy="category-details-dialog-close-button"]').click();

    // Refresh dataset to import Barcelona instead of Reference
    datasetManager.refreshDatasetFromFile('DLOP-PROD-13888-CheckOverview', 'cypress/fixtures/datasets/barcelona.zip');

    // Check the values in customer table have been updated
    cy.get('[data-cy="category-accordion-summary-customers"]').click();
    cy.get('[data-cy="category-details-dialog-open-button"]').eq(1).click();
    cy.wait(1000);
    // Check 4 colonnes
    cy.get('[role="treegrid"]').invoke('attr', 'aria-colcount').should('eq', '4');
    // Check 500 customers + headers = 5 lignes
    cy.get('[role="treegrid"]').invoke('attr', 'aria-rowcount').should('eq', '501');
    // Close the details
    cy.get('[data-cy="category-details-dialog-close-button"]').click();

    // Refresh dataset for an empty one to cause an error in the details
    datasetManager.refreshDatasetFromFile('DLOP-PROD-13888-CheckOverview', 'cypress/fixtures/datasets/EmptyDataset.zip');

    // Check the customer table is in error as expected
    cy.get('[data-cy="category-accordion-summary-customers"]').click();
    cy.get('[data-cy="category-details-dialog-open-button"]').eq(1).click();
    cy.wait(1000);
    cy.get('[data-cy="table-customers"]').should('contain', 'Returned result is empty, there is probably an error in your query configuration. Please, check your solution');
    // Close the details
    cy.get('[data-cy="category-details-dialog-close-button"]').click();

    // Switch back to Reference then refresh and reselect the correct dataset because sometimes, data are uploaded but not refreshed in the front
    datasetManager.refreshDatasetFromFile('DLOP-PROD-13888-CheckOverview', 'cypress/fixtures/datasets/reference.zip');
    cy.reload();
    datasetManager.selectDataset('DLOP-PROD-13888-CheckOverview');

    // Check values are back as normal
    cy.get('[data-cy="category-accordion-summary-customers"]').click();
    cy.get('[data-cy="category-details-dialog-open-button"]').eq(1).click();
    cy.wait(1000);
    // Check 4 colonnes
    cy.get('[role="treegrid"]').invoke('attr', 'aria-colcount').should('eq', '4');
    // Check 4 customers + headers = 5 lignes
    cy.get('[role="treegrid"]').invoke('attr', 'aria-rowcount').should('eq', '5');
    // Check you can switch to full screen
    cy.get('[data-cy="grid-fullscreen-button"]').should('not.be.disabled');
    // Check you can download the data
    cy.get('[data-cy="export-button"]').should('not.be.disabled');
    // Close the details
    cy.get('[data-cy="category-details-dialog-close-button"]').click();

    // No clean of the dataset, as it will be manually checked for wrong query request (require postman action, can't be automated)
  });

  it('PROD-13261: Check subdataset in error', () => {
    connection.connect();
    connection.navigate('dataset');

    // Remove in case it's a second try
    datasetManager.deleteDataset('DLOP-PROD-13261-SubdatasetError');

    // Create a dataset, can't use the function as it has to be aborted immediatly
    datasetManager.selectDataset('DLOP-Reference-for-automated-tests');
    // Create a new dataset
    cy.get('[data-cy="create-subdataset-button"]').click();
    // Enter the name of the subdataset
    cy.get('input[id^="mui-"]').clear({ force: true }).type('DLOP-PROD-13261-SubdatasetError', { force: true });
    // Go to next step
    cy.get('[data-cy=dataset-creation-next-step]').click();
    // Select the filter
    cy.contains('Dataset filter').click({ force: true });
    cy.get('[data-cy="enum-input-value-tooltip-etl_sub_dataset_by_filter_boolean"]').click({ force: true });
    // Select not-thristy
    cy.get('[role="combobox"]').eq(1).click({ force: true });
    cy.get('[data-cy="NOT_THIRSTY"]').click({ force: true });
    // Confirm the creation
    cy.get('[data-cy="confirm-dataset-creation"]').click({ force: true });
    cy.wait(1000);

    // Abort immediatly so the dataset will be in error
    cy.get('[data-cy="dataset-overview-abort-button"]', { timeout: 10000 }).click();
    cy.wait(1000);

    // Select the newly created dataset
    datasetManager.clearSearch();
    datasetManager.selectDataset('DLOP-PROD-13261-SubdatasetError');

    // Check the red symbol is diplaying
    cy.get('[data-cy^="refresh-error-icon-"]').should('exist');

    // Check the error message and the logs and retry buttons
    cy.get('[data-cy="dataset-overview-title"]').should('contain', 'An error occurred during import of your data');
    cy.get('[data-cy="runner-run-logs-download-button"]').should('exist');
    cy.get('[data-cy="dataset-overview-retry-button"]').should('exist');

    // Check actions are still possible, except create a subdataset
    cy.get('[data-cy^="dataset-refresh-button-"]').should('not.be.disabled');
    cy.get('[data-cy="edit-dataset-parameters-button"]').should('not.be.disabled');
    cy.get('[data-testid="ShareIcon"]').should('not.be.disabled');
    cy.get('[data-testid="DeleteForeverIcon"]').should('not.be.disabled');
    cy.get('[data-cy="create-subdataset-button"]').should('be.disabled');

    // Refresh and check the dataset is still in error
    cy.reload();
    datasetManager.selectDataset('DLOP-PROD-13261-SubdatasetError');
    cy.get('[data-cy^="refresh-error-icon-"]').should('exist');
    cy.get('[data-cy="dataset-overview-title"]').should('contain', 'An error occurred during import of your data');
    cy.get('[data-cy="runner-run-logs-download-button"]').should('exist');
    cy.get('[data-cy="dataset-overview-retry-button"]').should('exist');

    // Delete the dataset
    datasetManager.clearSearch();
    datasetManager.deleteDataset('DLOP-PROD-13261-SubdatasetError');
  });

  it('PROD-13313: Action disabled during creation/refresh', () => {
    connection.connect();
    connection.navigate('dataset');

    // Clean in case it's a second try
    datasetManager.deleteDataset('DLOP-PROD-13313-FromFile');
    datasetManager.deleteDataset('DLOP-PROD-13313-AzureStorage');

    // Create a dataset from file, can't use the function as checks have to be done during the import
    cy.get('[data-testid="AddIcon"]', { timeout: 60000 }).click();
    // Enter the name of the dataset
    cy.get('[data-cy="text-input-new-dataset-title"]').click().type('DLOP-PROD-13313-FromFile');
    // Go to next step
    cy.get('[data-cy=dataset-creation-next-step]').click();
    // Select the source
    cy.get('[data-cy="enum-input-select-new-dataset-sourceType"]').click();
    cy.get('[data-cy=enum-input-value-tooltip-File]').click();
    // Browse the dataset
    cy.get('[data-cy=browse-button]').selectFile('cypress/fixtures/datasets/reference.zip', { force: true });
    cy.wait(1000);
    // Confirm the creation
    cy.get('[data-cy="confirm-dataset-creation"]').click();
    // Check dataset is created
    cy.get('[data-cy="datasets-list"]').should('contain', 'DLOP-PROD-13313-FromFile');

    // Check actions are disabled during creation, except sharing
    cy.get('[data-cy^="dataset-reupload-button-"]').invoke('attr', 'aria-disabled').should('eq', 'true');
    cy.get('[data-cy="create-subdataset-button"]').should('be.disabled');
    cy.get('[data-cy^="dataset-actions-dataset-delete-button-"]').should('be.disabled');
    cy.get('[data-cy="share-scenario-button"]').should('not.be.disabled');

    // Wait for the creation end
    cy.wait(1000);
    cy.get('[data-cy*="dataset-reupload-button-"]', { timeout: 60000 }).should('not.be.disabled', { timeout: 60000 });
    cy.get('[data-cy="dataset-overview-title"]', { timeout: 60000 }).should('not.exist');
    cy.wait(1000);

    // Refresh the dataset to check if the actions are disabled too, except sharing
    cy.get('[data-cy^="dataset-reupload-button-"]').click();
    cy.get('[data-cy="refresh-dataset-dialog-confirm-button"]').click();
    cy.get('[id^="dataset-reupload-input-"]').selectFile('cypress/fixtures/datasets/barcelona.zip', { force: true });

    // Check actions are disabled during refresh, except sharing
    cy.get('[data-cy^="dataset-reupload-button-"]').invoke('attr', 'aria-disabled').should('eq', 'true');
    cy.get('[data-cy="create-subdataset-button"]').should('be.disabled');
    cy.get('[data-cy^="dataset-actions-dataset-delete-button-"]').should('be.disabled');
    cy.get('[data-cy="share-scenario-button"]').should('not.be.disabled');

    // Wait for the end of the refresh
    cy.wait(1000);
    cy.get('[data-cy*="dataset-reupload-button-"]', { timeout: 60000 }).should('not.be.disabled', { timeout: 60000 });
    cy.get('[data-cy="dataset-overview-title"]', { timeout: 60000 }).should('not.exist');
    cy.wait(1000);

    // Create a dataset from AzureStorage, can't use the function as checks have to be done during the import
    cy.get('[data-testid="AddIcon"]', { timeout: 60000 }).click();
    // Enter the name of the dataset
    cy.get('[data-cy="text-input-new-dataset-title"]').click().type('DLOP-PROD-13313-AzureStorage');
    // Go to next step
    cy.get('[data-cy=dataset-creation-next-step]').click();
    // Select the source
    cy.get('[data-cy="enum-input-select-new-dataset-sourceType"]').click();
    cy.get('[data-cy=enum-input-value-tooltip-AzureStorage]').click();
    // Enter the requested information
    cy.get('#text-input-name').click({ force: true }).clear().type(config.accountName(), { force: true });
    cy.get('#text-input-location').click({ force: true }).clear().type(config.containerName(), { force: true });
    cy.get('#text-input-path').click({ force: true }).clear().type(config.storagePath(), { force: true });
    // Confirm the creation
    cy.get('[data-cy="confirm-dataset-creation"]').click();
    // Check dataset is created
    cy.get('[data-cy="datasets-list"]').should('contain', 'DLOP-PROD-13313-AzureStorage');

    // Check actions are disabled during creation, except sharing
    cy.get('[data-cy*="dataset-refresh-button-"]').should('be.disabled');
    cy.get('[data-cy="create-subdataset-button"]').should('be.disabled');
    cy.get('[data-cy^="dataset-actions-dataset-delete-button-"]').should('be.disabled');
    cy.get('[data-cy="share-scenario-button"]').should('not.be.disabled');

    // Wait for the creation end
    cy.wait(1000);
    cy.get('[data-cy*="dataset-refresh-button-"]', { timeout: 60000 }).should('not.be.disabled', { timeout: 60000 });

    // Refresh the dataset to check if the actions are disabled too, except sharing
    cy.get('[data-cy*="dataset-refresh-button-"]').click();
    cy.get('[data-cy="refresh-dataset-dialog-confirm-button"]').click();

    // Check actions are disabled during refresh, except sharing
    cy.get('[data-cy*="dataset-refresh-button-"]').should('be.disabled');
    cy.get('[data-cy="create-subdataset-button"]').should('be.disabled');
    cy.get('[data-cy^="dataset-actions-dataset-delete-button-"]').should('be.disabled');
    cy.get('[data-cy="share-scenario-button"]').should('not.be.disabled');

    // Wait for the end of the refresh
    cy.wait(1000);
    cy.wait(1000);
    cy.get('[data-cy*="dataset-refresh-button-"]', { timeout: 60000 }).should('not.be.disabled', { timeout: 60000 });
    cy.wait(1000);

    // Delete the datasets
    datasetManager.clearSearch();
    datasetManager.deleteDataset('DLOP-PROD-13313-FromFile');
    datasetManager.deleteDataset('DLOP-PROD-13313-AzureStorage');
  });

  it('PROD-13201: Check logs are available if ETL fails', () => {
    connection.connect();
    connection.navigate('dataset');

    // Clean in case it's a second try
    datasetManager.deleteDataset('DLOP-PROD-13201-Logs');

    // Create a dataset will be done manually, as there is no function to create dataset using an ETL and it depends too much on the environment.
    cy.get('[data-testid="AddIcon"]', { timeout: 10000 }).click();
    // Enter the name of the dataset
    cy.get('[data-cy="text-input-new-dataset-title"]').click().type('DLOP-PROD-13201-Logs');
    // Go to next step
    cy.get('[data-cy=dataset-creation-next-step]').click();
    // Select the source
    cy.get('[data-cy="enum-input-select-new-dataset-sourceType"]').click();
    cy.get('[data-cy="enum-input-value-tooltip-etl_with_local_file"]').click();
    // Browse the dataset (for this ETL, only zip files named reference are accepted, so Barcelona will cause an error)
    cy.get('[data-cy=browse-button]').selectFile('cypress/fixtures/datasets/barcelona.zip', { force: true });
    cy.wait(1000);
    // Confirm the creation
    cy.get('[data-cy="confirm-dataset-creation"]').click();
    // Check dataset is created
    cy.get('[data-cy="datasets-list"]').should('contain', 'DLOP-PROD-13201-Logs');
    cy.get('[data-cy*="dataset-refresh-button-"]', { timeout: 300000 }).should('not.be.disabled', { timeout: 60000 });

    // Check logs can be downloaded
    cy.get('[data-cy="runner-run-logs-download-button"]').should('not.be.disabled');

    // Refresh and cancel, check the logs are still available
    cy.get('[data-cy^="dataset-refresh-button-"]').click();
    cy.get('[data-cy="refresh-dataset-dialog-cancel-button"]').click();
    cy.get('[data-cy*="dataset-refresh-button-"]', { timeout: 300000 }).should('not.be.disabled', { timeout: 60000 });
    cy.get('[data-cy="runner-run-logs-download-button"]').should('not.be.disabled');

    // Refresh, overwrite and check the logs are still available
    cy.get('[data-cy^="dataset-refresh-button-"]').click();
    cy.get('[data-cy="refresh-dataset-dialog-confirm-button"]').click();
    cy.wait(2000);
    cy.get('[data-cy*="dataset-refresh-button-"]', { timeout: 300000 }).should('not.be.disabled', { timeout: 60000 });
    cy.get('[data-cy="runner-run-logs-download-button"]').should('not.be.disabled');

    // Delete the datasets
    datasetManager.deleteDataset('DLOP-PROD-13201-Logs');
  });
});
