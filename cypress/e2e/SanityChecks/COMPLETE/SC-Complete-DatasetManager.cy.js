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

  it('PROD-13297 and PROD-13261: Check subdataset in error', () => {
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

  it('PROD-13321: MultiSelector in ETL', () => {
    connection.connect();
    connection.navigate('dataset');

    // Create manually a dataset from Barcelona, because the test checks the creation form
    datasetManager.selectDataset('DLOP-Barcelona-for-automated-tests');
    // Create a new dataset
    cy.get('[data-cy="create-subdataset-button"]').click();
    // Enter the name of the subdataset
    cy.get('input[id^="mui-"]').clear({ force: true }).type('DLOP-PROD-13321-MultiSelector', { force: true });
    // Go to next step
    cy.get('[data-cy=dataset-creation-next-step]').click();

    // Select the filter
    cy.contains('Dataset filter').click({ force: true });
    cy.get('[data-value=".//etl_sub_dataset_by_filter"]').click({ force: true });

    // Check the available options
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect"]').click({ force: true });
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-0"]').should('contain', 'Thirsty');
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-1"]').should('contain', 'Not thirsty');

    // Check values returned with the input text
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect"]').type('false');
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-0"]').should('not.exist');
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-1"]').should('not.exist');

    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect"]').clear().type('thirsty');
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-0"]').should('exist');
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-1"]').should('exist');

    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect"]').clear().type('no');
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-0"]').should('exist');
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-0"]').should('contain', 'Not thirsty');
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-1"]').should('not.exist');

    // Select the "Not Thirsty" option
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-0"]').click();
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-0"]').should('exist');
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-1"]').find('[type="checkbox"]').should('be.checked');
    cy.get('[data-cy="confirm-dataset-creation"]').should('not.be.disabled');

    // Remove the selected option
    cy.get('[data-tag-index="0"]').find('[data-testid="CancelIcon"]').click();
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-1"]').find('[type="checkbox"]').should('not.be.checked');
    cy.get('[data-cy="confirm-dataset-creation"]').should('be.disabled');

    // Check the two options displays and are not checked
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-0"]').should('exist');
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-0"]').find('[type="checkbox"]').should('not.be.checked');
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-1"]').should('exist');
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-1"]').find('[type="checkbox"]').should('not.be.checked');

    // Select both options
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-0"]').click();
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-1"]').click();
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-0"]').find('[type="checkbox"]').should('be.checked');
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-1"]').find('[type="checkbox"]').should('be.checked');
    cy.get('[data-cy="confirm-dataset-creation"]').should('not.be.disabled');

    // Remove the option "not thirsty"
    cy.get('[data-tag-index="1"]').find('[data-testid="CancelIcon"]').click();
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-0"]').should('exist');
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-0"]').find('[type="checkbox"]').should('be.checked');
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-1"]').should('exist');
    cy.get('[id="etl_param_subdataset_filter_thirsty_multiselect-option-1"]').find('[type="checkbox"]').should('not.be.checked');

    // Click on previous then next. Previous selection is persistent
    cy.get('[data-cy="dataset-creation-previous-step"]').click({ force: true });
    cy.get('[data-cy="dataset-creation-next-step"]').click({ force: true });
    cy.contains('Dataset filter').click({ force: true });
    cy.get('[data-value=".//etl_sub_dataset_by_filter"]').click({ force: true });
    cy.get('[data-tag-index="0"]').should('contain', 'Thirsty');
    cy.get('[data-cy="confirm-dataset-creation"]').should('not.be.disabled');

    // Cancel the subdataset creation. As nothing has been created, no need for deletion
    cy.get('[data-cy="cancel-dataset-creation"]').click();
  });

  it('PROD-13192, PROD-13312 and PROD-13323: Dynamic MultiSelector in ETL', () => {
    connection.connect();
    connection.navigate('dataset');

    // Clean in case it's a second try
    datasetManager.deleteDataset('DLOP-PROD-13323-DynamicMultiSelector');

    // Create a dataset with Barcelona
    datasetManager.createDatasetLocalFile('DLOP-PROD-13323-DynamicMultiSelector', 'Dynamic Selector Check Test', 'barcelona');

    // Create manually a subdataset, because the test checks the creation form
    cy.get('[data-cy="create-subdataset-button"]').click();
    // Enter the name of the subdataset
    cy.get('input[id^="mui-"]').clear({ force: true }).type('DLOP-PROD-13323-DynamicMultiSelector', { force: true });
    // Go to next step
    cy.get('[data-cy=dataset-creation-next-step]').click();

    // Select the filter
    cy.contains('Dataset filter').click({ force: true });
    cy.get('[data-cy=".///etl_sub_dataset_by_filter"]').click({ force: true });

    // Check there is 500 options listed and randomly check one of the opation
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list"]').click({ force: true });
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-499"]').should('exist');
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-500"]').should('not.exist');
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-142"]').should('contain', 'Rosalina_Silva');

    // Check search returns the 6 expected values only
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list"]').type('Rosa');
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-5"]').should('exist');
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-6"]').should('not.exist');

    // Select "Rosalina_Silva" and "Ruy_Rosales"
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-1"]').click();
    // Selection removed the filter, so filtering again and selecting the second name
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list"]').type('Rosa');
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-4"]').click();

    // Click on previous then next. Previous selection is persistent
    cy.get('[data-cy="dataset-creation-previous-step"]').click({ force: true });
    cy.get('[data-cy="dataset-creation-next-step"]').click({ force: true });
    cy.contains('Dataset filter').click({ force: true });
    cy.get('[data-cy=".///etl_sub_dataset_by_filter"]').click({ force: true });
    cy.get('[data-tag-index="0"]').should('contain', 'Rosalina_Silva');
    cy.get('[data-tag-index="1"]').should('contain', 'Ruy_Rosales');
    cy.get('[data-cy="confirm-dataset-creation"]').should('not.be.disabled');

    // Cancel the subdataset creation, then refresh the dataset to have the Reference dataset values
    cy.get('[data-cy="cancel-dataset-creation"]').click();
    cy.get('[data-cy^="dataset-reupload-button-"]').click();
    cy.get('[data-cy="refresh-dataset-dialog-confirm-button"]').click();
    cy.get('[id^="dataset-reupload-input-"]').selectFile('cypress/fixtures/datasets/reference.zip', { force: true });
    // Wait for the end of the refresh
    cy.wait(1000);
    cy.get('[data-cy*="dataset-reupload-button-"]', { timeout: 60000 }).should('not.be.disabled', { timeout: 60000 });
    cy.get('[data-cy="dataset-overview-title"]', { timeout: 60000 }).should('not.exist');
    cy.wait(1000);

    // Create manually a subdataset, because the test checks the creation form
    cy.get('[data-cy="create-subdataset-button"]').click();
    // Enter the name of the subdataset
    cy.get('input[id^="mui-"]').clear({ force: true }).type('DLOP-PROD-13323-DynamicMultiSelector', { force: true });
    // Go to next step
    cy.get('[data-cy=dataset-creation-next-step]').click();

    // Select the filter
    cy.contains('Dataset filter').click({ force: true });
    cy.get('[data-cy=".///etl_sub_dataset_by_filter"]').click({ force: true });

    // Check there is only 4 options listed and randomly check one of the option
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list"]').click({ force: true });
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-3"]').should('exist');
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-4"]').should('not.exist');

    // Tick and untick values to check the selector is working properly
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-0"]').click();
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-2"]').click();
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-0"]').find('[type="checkbox"]').should('be.checked');
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-1"]').find('[type="checkbox"]').should('not.be.checked');
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-2"]').find('[type="checkbox"]').should('be.checked');
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-3"]').find('[type="checkbox"]').should('not.be.checked');
    cy.get('[data-tag-index="0"]').find('[data-testid="CancelIcon"]').click();
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-0"]').find('[type="checkbox"]').should('not.be.checked');
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-1"]').find('[type="checkbox"]').should('not.be.checked');
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-2"]').find('[type="checkbox"]').should('be.checked');
    cy.get('[id="etl_param_subdataset_filter_dynamic_customers_list-option-3"]').find('[type="checkbox"]').should('not.be.checked');

    // Cancel the creation form.
    cy.get('[data-cy="cancel-dataset-creation"]').click({ force: true });

    // Delete the dataset, no manual tests needed.
    datasetManager.deleteDataset('DLOP-PROD-13323-DynamicMultiSelector');
  });

  it('PROD-13260: Subdataset of subdataset', () => {
    connection.connect();
    connection.navigate('dataset');

    // Clean in case it's a second try
    scenario.deleteScenario('DLOP-PROD-13260-SubFromSub');
    datasetManager.deleteDataset('DLOP-PROD-13260-SubFromSub');
    datasetManager.deleteDataset('DLOP-PROD-13260-Sub');

    // Create a subdataset from Reference
    datasetManager.createSubDataset('DLOP-Reference-for-automated-tests', 'DLOP-PROD-13260-Sub', 'Subdataset of the parent "Reference"');

    // Refresh the webapp because if there is an error in the subdataset, then the "create subdataset" button will be disabled
    // and the test will fail (which is expected, no error should result from the subdataset creation). It prevent later failure
    // when the error is in the previous step.
    cy.reload();

    // Create a subdataset from the previous subdataset
    datasetManager.createSubDataset('DLOP-PROD-13260-Sub', 'DLOP-PROD-13260-SubFromSub', 'Subdataset of a subdataset');

    // Create and run a scenario from the second dataset
    scenario.createScenario('DLOP-PROD-13260-SubFromSub', 'master', 'DLOP-PROD-13260-SubFromSub', 'NoParameters');
    scenario.runScenario('DLOP-PROD-13260-SubFromSub');

    // Clean the datasets and the scenario, as no manually checks are needed
    scenario.deleteScenario('DLOP-PROD-13260-SubFromSub');
    datasetManager.deleteDataset('DLOP-PROD-13260-SubFromSub');
    datasetManager.deleteDataset('DLOP-PROD-13260-Sub');
  });

  it('PROD-13188: Check error management in dataset manager', () => {
    connection.connect();
    connection.navigate('dataset');

    // Clean in case it's a second try
    datasetManager.deleteDataset('DLOP-PROD-13188-ErrorFromFile');

    // Create a dataset in error, the function can't be used as it checks the dataset is well created and the objective here is to create a dataset in error
    cy.get('[data-testid="AddIcon"]', { timeout: 60000 }).click();
    // Enter the name of the dataset
    cy.get('[data-cy="text-input-new-dataset-title"]').click().type('DLOP-PROD-13188-ErrorFromFile');
    // Go to next step
    cy.get('[data-cy=dataset-creation-next-step]').click();
    // Select the source
    cy.get('[data-cy="enum-input-select-new-dataset-sourceType"]').click();
    cy.get('[data-cy=enum-input-value-tooltip-File]').click();
    // Browse the dataset
    cy.get('[data-cy=browse-button]').selectFile('cypress/fixtures/datasets/FalseDataset.zip', { force: true });
    cy.wait(1000);
    // Confirm the creation
    cy.get('[data-cy="confirm-dataset-creation"]').click();
    // Check dataset is created
    cy.get('[data-cy="datasets-list"]').should('contain', 'DLOP-PROD-13188-ErrorFromFile');
    cy.wait(1000);

    // Check behavior
    datasetManager.selectDataset('DLOP-PROD-13188-ErrorFromFile');
    cy.get('[data-testid="ErrorIcon"]').should('exist');
    cy.get('[data-cy="dataset-overview-title"]').should('have.text', 'An error occurred during import of your data');
    cy.get('[data-cy^="dataset-reupload-button-"]').should('not.be.disabled');
    cy.get('[data-cy="create-subdataset-button"]').should('be.disabled');
    cy.get('[data-cy="share-scenario-button"]').should('not.be.disabled');
    cy.get('[data-cy^="dataset-actions-dataset-delete-button-"]').should('not.be.disabled');

    // Refresh the webapp and check the error is still persistent
    cy.reload();
    datasetManager.selectDataset('DLOP-PROD-13188-ErrorFromFile');
    cy.get('[data-testid="ErrorIcon"]').should('exist');
    cy.get('[data-cy="dataset-overview-title"]').should('have.text', 'An error occurred during import of your data');
    cy.get('[data-cy^="dataset-reupload-button-"]').should('not.be.disabled');
    cy.get('[data-cy="create-subdataset-button"]').should('be.disabled');
    cy.get('[data-cy="share-scenario-button"]').should('not.be.disabled');
    cy.get('[data-cy^="dataset-actions-dataset-delete-button-"]').should('not.be.disabled');

    // Clean the datasets and the scenario, as no manually checks are needed
    datasetManager.deleteDataset('DLOP-PROD-13188-ErrorFromFile');
  });

  it('PROD-13191: Search bar check', () => {
    connection.connect();
    connection.navigate('dataset');

    // Check the two dataset used for this test are displayed before research.
    cy.get('[data-cy="datasets-list"]').should('contain', 'DLOP-Barcelona-for-automated-tests');
    cy.get('[data-cy="datasets-list"]').should('contain', 'DLOP-Reference-for-automated-tests');

    // Search for a word only in the title of one dataset
    cy.get('[id="dataset-search-bar"]').type('Reference');
    cy.get('[data-cy="datasets-list"]').should('not.contain', 'DLOP-Barcelona-for-automated-tests');
    cy.get('[data-cy="datasets-list"]').should('contain', 'DLOP-Reference-for-automated-tests');

    // Search for the tag, which is set for the two dataset
    cy.get('[id="dataset-search-bar"]').clear().type('localFile');
    cy.get('[data-cy="datasets-list"]').should('contain', 'DLOP-Barcelona-for-automated-tests');
    cy.get('[data-cy="datasets-list"]').should('contain', 'DLOP-Reference-for-automated-tests');

    // Search for a word that is in the description of one of the dataset, and it returns no dataset because search is not on description field.
    cy.get('[id="dataset-search-bar"]').clear().type('basic');
    cy.get('[data-cy="datasets-list"]').should('not.contain', 'DLOP-Barcelona-for-automated-tests');
    cy.get('[data-cy="datasets-list"]').should('not.contain', 'DLOP-Reference-for-automated-tests');

    datasetManager.clearSearch();
    // No need to clean, as no dataset as been created
  });

  it('PROD-13189, PROD-13187: Edition of metadata and deletion', () => {
    connection.connect();
    connection.navigate('dataset');

    // Clean in case it's a second try
    datasetManager.deleteDataset('DLOP-PROD-13187-EditionAndDeletion-FromLocalFile');
    datasetManager.deleteDataset('DLOP-PROD-13187-EditionAndDeletion-FromAzureStorage');
    datasetManager.deleteDataset('DLOP-PROD-13187-EditionAndDeletion-FromEmpty');

    // Create a dataset from file
    datasetManager.createDatasetLocalFile('DLOP-PROD-13187-EditionAndDeletion-FromLocalFile', 'A basic reference dataset for brewery model', 'reference');
    datasetManager.selectDataset('DLOP-PROD-13187-EditionAndDeletion-FromLocalFile');

    // Check the URL has been generated and can be copied
    cy.get('[data-cy="dataset-metadata-api-url"]').should('contain', 'datasets/d-');
    cy.get('[data-cy="dataset-metadata-copy-api-url-button"]').should('exist');

    // Remove the original tag and create a new one
    cy.get('[data-cy="tags-container"]').find('[data-testid="CancelIcon"]').click();
    cy.get('[data-cy="add-tag"]').click({ force: true });
    cy.get('[id="new-tag-input"]').type('NewTag').type('{enter}');

    // Remove the original description and create a new one
    cy.get('[data-cy="dataset-metadata-description"]').contains('A basic reference dataset for brewery model').click();
    cy.get('[id="description-input"]').type('Updated description: ');
    cy.get('[data-cy="dataset-metadata-source-type"]').click();

    // Check the new tag and the new description are saved and persistent
    cy.reload();
    datasetManager.selectDataset('DLOP-PROD-13187-EditionAndDeletion-FromLocalFile');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'NewTag');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Updated description: A basic reference dataset for brewery model');

    // Delete the dataset, cancel the deletion, check the dataset is still here
    cy.get('[data-cy^="dataset-actions-dataset-delete-button"]').click();
    cy.get('[id="delete-datasetid-button1"]').click();
    datasetManager.clearSearch();
    datasetManager.selectDataset('DLOP-PROD-13187-EditionAndDeletion-FromLocalFile');

    // Delete the dataset, and confirm
    datasetManager.deleteDataset('DLOP-PROD-13187-EditionAndDeletion-FromLocalFile');

    // Create a dataset from Azure Storage
    datasetManager.createDatasetAzureStorage('DLOP-PROD-13187-EditionAndDeletion-FromAzureStorage', 'A basic reference dataset for brewery model', config.accountName(), config.containerName(), config.storagePath());
    datasetManager.selectDataset('DLOP-PROD-13187-EditionAndDeletion-FromAzureStorage');

    // Check the URL has been generated and can be copied
    cy.get('[data-cy="dataset-metadata-api-url"]').should('contain', 'datasets/d-');
    cy.get('[data-cy="dataset-metadata-copy-api-url-button"]').should('exist');

    // Remove the original tag and create a new one
    cy.get('[data-cy="tags-container"]').find('[data-testid="CancelIcon"]').click();
    cy.get('[data-cy="add-tag"]').click({ force: true });
    cy.get('[id="new-tag-input"]').type('NewTag').type('{enter}');

    // Remove the original description and create a new one
    cy.get('[data-cy="dataset-metadata-description"]').contains('A basic reference dataset for brewery model').click();
    cy.get('[id="description-input"]').type('Updated description: ');
    cy.get('[data-cy="dataset-metadata-source-type"]').click();

    // Check the new tag and the new description are saved and persistent
    cy.reload();
    datasetManager.selectDataset('DLOP-PROD-13187-EditionAndDeletion-FromAzureStorage');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'NewTag');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Updated description: A basic reference dataset for brewery model');

    // Delete the dataset, cancel the deletion, check the dataset is still here
    cy.get('[data-cy^="dataset-actions-dataset-delete-button"]').click();
    cy.get('[id="delete-datasetid-button1"]').click();
    datasetManager.clearSearch();
    datasetManager.selectDataset('DLOP-PROD-13187-EditionAndDeletion-FromAzureStorage');

    // Delete the dataset, and confirm
    datasetManager.deleteDataset('DLOP-PROD-13187-EditionAndDeletion-FromAzureStorage');

    // Create a dataset from Empty (no function created, as it's only used in uncommon tests)
    cy.get('[data-testid="AddIcon"]', { timeout: 60000 }).click();
    // Enter the name of the dataset
    cy.get('[data-cy="text-input-new-dataset-title"]').click().type('DLOP-PROD-13187-EditionAndDeletion-FromEmpty');
    // Enter the tags
    cy.get('#new-dataset-tags').click().type('empty').type('{enter}');
    // Enter the description
    cy.get('[data-cy="text-input-new-dataset-description"]').click().type('A basic reference dataset for brewery model');
    // Go to next step
    cy.get('[data-cy=dataset-creation-next-step]').click();
    // Select the source
    cy.get('[data-cy="enum-input-select-new-dataset-sourceType"]').click();
    cy.get('[data-cy="None"]').click();
    // Confirm the creation
    cy.get('[data-cy="confirm-dataset-creation"]').click();
    // Check dataset is created
    cy.get('[data-cy="datasets-list"]').should('contain', 'DLOP-PROD-13187-EditionAndDeletion-FromEmpty');
    cy.wait(1000);
    datasetManager.selectDataset('DLOP-PROD-13187-EditionAndDeletion-FromEmpty');

    // Check the URL has been generated and can be copied
    cy.get('[data-cy="dataset-metadata-api-url"]').should('contain', 'datasets/d-');
    cy.get('[data-cy="dataset-metadata-copy-api-url-button"]').should('exist');

    // Remove the original tag and create a new one
    cy.get('[data-cy="tags-container"]').find('[data-testid="CancelIcon"]').click();
    cy.get('[data-cy="add-tag"]').click({ force: true });
    cy.get('[id="new-tag-input"]').type('NewTag').type('{enter}');

    // Remove the original description and create a new one
    cy.get('[data-cy="dataset-metadata-description"]').contains('A basic reference dataset for brewery model').click();
    cy.get('[id="description-input"]').type('Updated description: ');
    cy.get('[data-cy="dataset-metadata-source-type"]').click();

    // Check the new tag and the new description are saved and persistent
    cy.reload();
    datasetManager.selectDataset('DLOP-PROD-13187-EditionAndDeletion-FromEmpty');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'NewTag');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Updated description: A basic reference dataset for brewery model');

    // Delete the dataset, cancel the deletion, check the dataset is still here
    cy.get('[data-cy^="dataset-actions-dataset-delete-button"]').click();
    cy.get('[id="delete-datasetid-button1"]').click();
    datasetManager.clearSearch();
    datasetManager.selectDataset('DLOP-PROD-13187-EditionAndDeletion-FromEmpty');

    // Delete the dataset, and confirm
    datasetManager.deleteDataset('DLOP-PROD-13187-EditionAndDeletion-FromEmpty');

    // Clean the created datasets is not needed, they have been deleted within the test
  });

  it('PROD-14423: Check fields for ETL dataset creation', () => {
    connection.connect();
    connection.navigate('dataset');

    // Clean in case it's a second try
    datasetManager.deleteDataset('DLOP-PROD-14423-ETLFieldsCheck');

    // Check ETL with tag "datasource" are not in the run types. So create a scenario and try to search for the ETL. No returns.
    connection.navigate('scenario-view');
    cy.get('[data-cy="create-scenario-button"]').click({ force: true });
    cy.get('[id="scenarioType"]').click({ force: true });
    cy.get('[id="scenarioType"]').click().clear().type('Brewery (.zip)');
    cy.get('[role="presentation"]').should('contain.text', 'No options');
    cy.get('[data-cy="create-scenario-dialog-cancel-button"]').click();

    // Set the language to French
    // Navigate through the menu to reach the language parameters
    cy.get('[data-cy="user-profile-menu"]').click({ force: true });
    cy.get('[data-cy="change-language"]').click({ force: true });
    // Set language
    cy.get('[data-cy="set-lang-fr"]').click({ force: true });

    // Open the dataset creation popup and check the name of the ETL is in French,
    // as defined in the Solution.json file (may change if webapp configuration is updated)
    connection.navigate('dataset');
    cy.get('[data-testid="AddIcon"]', { timeout: 60000 }).click();
    // Enter the name of the dataset
    cy.get('[data-cy="text-input-new-dataset-title"]').click().type('DLOP-PROD-14423-ETLFieldsCheck');
    // Go to next step
    cy.get('[data-cy=dataset-creation-next-step]').click();
    // Select the source
    cy.get('[data-cy="enum-input-select-new-dataset-sourceType"]').click();
    // Check the names for the ETL
    cy.get('[data-cy="enum-input-value-tooltip-etl_with_local_file"]').should('have.text', 'Brewery (.zip) depuis un fichier local');
    cy.get('[data-cy="enum-input-value-tooltip-etl_with_azure_storage"]').should('have.text', 'Brewery (.zip) depuis Azure Storage');
    // Cancel creation
    cy.get('[data-cy="cancel-dataset-creation"]').click({ force: true });

    // Set the language back to English
    // Navigate through the menu to reach the language parameters
    cy.get('[data-cy="user-profile-menu"]').click({ force: true });
    cy.get('[data-cy="change-language"]').click({ force: true });
    // Set language
    cy.get('[data-cy="set-lang-en"]').click({ force: true });

    // Open the dataset creation popup and check the name of the ETL are back in English,
    // as defined in the Solution.json file (may change if webapp configuration is updated)
    connection.navigate('dataset');
    cy.get('[data-testid="AddIcon"]', { timeout: 60000 }).click();
    // Enter the name of the dataset
    cy.get('[data-cy="text-input-new-dataset-title"]').click().type('DLOP-PROD-14423-ETLFieldsCheck');
    // Go to next step
    cy.get('[data-cy=dataset-creation-next-step]').click();
    // Select the source
    cy.get('[data-cy="enum-input-select-new-dataset-sourceType"]').click();
    // Check the names for the ETL
    cy.get('[data-cy="enum-input-value-tooltip-etl_with_local_file"]').should('have.text', 'Brewery (.zip) from Local File');
    cy.get('[data-cy="enum-input-value-tooltip-etl_with_azure_storage"]').should('have.text', 'Brewery (.zip) from Azure Storage');
    // Choose the source
    cy.get('[data-cy="enum-input-value-tooltip-etl_with_local_file"]').click();
    // Update the stock and restock values
    cy.get('[id="text-input-etl_param_stock"]').click().clear().type('50');
    cy.get('[id="text-input-etl_param_restock_quantity"]').click().clear().type('15');
    // Upload the Reference.zip file
    cy.get('[data-cy=browse-button]').selectFile('cypress/fixtures/datasets/reference.zip', { force: true });
    cy.wait(1000);
    // Confirm the creation
    cy.get('[data-cy="confirm-dataset-creation"]').click();
    // Check dataset is created
    cy.get('[data-cy="datasets-list"]').should('contain', 'DLOP-PROD-14423-ETLFieldsCheck');
    cy.get('[data-cy*="dataset-refresh-button-"]', { timeout: 60000 }).should('not.be.disabled', { timeout: 60000 });

    // Edit the dataset and check values are those defined during the creation
    cy.get('[data-cy="edit-dataset-parameters-button"]').click();
    cy.get('[id="text-input-etl_param_stock"]').should('have.value', '50');
    cy.get('[id="text-input-etl_param_restock_quantity"]').should('have.value', '15');
    cy.get('[id="text-input-etl_param_num_waiters"]').should('have.value', '5');

    // Edit the values
    cy.get('[id="text-input-etl_param_stock"]').click().clear().type('200');
    cy.get('[id="text-input-etl_param_num_waiters"]').click().clear().type('20');

    // Save the edition, then wait for the update of the data
    cy.get('[data-cy="update-dataset-parameters-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy*="dataset-refresh-button-"]', { timeout: 60000 }).should('not.be.disabled', { timeout: 60000 });
    cy.wait(1000);

    // Reopen the edition and check values are those updated
    cy.get('[data-cy="edit-dataset-parameters-button"]').click();
    cy.get('[id="text-input-etl_param_stock"]').should('have.value', '200');
    cy.get('[id="text-input-etl_param_restock_quantity"]').should('have.value', '15');
    cy.get('[id="text-input-etl_param_num_waiters"]').should('have.value', '20');

    // Cancel the edition
    cy.get('[data-cy="close-update-dataset-parameters-dialog-button"]').click();
    cy.wait(1000);

    // Clean the dataset, as no manual check is needed
    datasetManager.deleteDataset('DLOP-PROD-14423-ETLFieldsCheck');
  });
});
