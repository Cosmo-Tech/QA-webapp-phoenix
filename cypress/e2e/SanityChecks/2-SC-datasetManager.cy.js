import 'cypress-file-upload';
var connection = require('../../functions/connect.cy.js');
var datasetManager = require('../../functions/datasetManager.cy.js');
var config = require('../../../variables.cy.js');
var scenario = require('../../functions/scenario.cy.js');

describe('Dataset Manager Sanity Checks', () => {
  it('PROD-12909 & PROD-12979 -> Create from Local File and check Overview', () => {
    connection.connect();
    var datasetName = 'PROD-12909';
    // Clean in case of another try
    scenario.deleteScenario(datasetName);
    datasetManager.deleteDataset(datasetName);

    connection.navigate('dataset');
    // Create the dataset
    datasetManager.createDatasetLocalFile(datasetName, 'A basic reference dataset for brewery model', 'reference');
    // Check the information
    datasetManager.selectDataset(datasetName);
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Author');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Dave Lauper');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Creation date');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Source');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'File');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'API URL');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Tags');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'localFile');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Description');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'A basic reference dataset for brewery model');

    // Check you can edit metadata
    cy.get('[data-testid="CancelIcon"').click();
    cy.get('[data-cy="dataset-tags-tag-0"]').should('not.exist');
    cy.get('[data-cy=add-tag]', { force: true }).click({ force: true });
    cy.get('#new-tag-input').type('localFileAgain', { force: true }).type('{enter}', { force: true });
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'localFileAgain');
    cy.contains('A basic reference dataset for brewery model', { force: true }).click({ force: true });
    cy.get('#description-input').type('Updated description: ');
    cy.get('[data-cy="dataset-metadata-description"]').click();
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Updated description: A basic reference dataset for brewery model');
    datasetManager.clearSearch();

    // Check overview
    datasetManager.overviewDataset(datasetName);

    // Check you can create a scenario with the created dataset
    connection.navigate('scenario-view');
    scenario.createScenario(datasetName, 'master', datasetName, 'NoParameters');
    scenario.runScenario(datasetName);
  });

  it('PROD-12910 & PROD-12979 -> Create from Azure Storage and check Overview', () => {
    connection.connect();
    var datasetName = 'PROD-12910';
    // Clean in case of another try
    scenario.deleteScenario(datasetName);
    datasetManager.deleteDataset(datasetName);

    connection.navigate('dataset');
    // Create the dataset
    datasetManager.createDatasetAzureStorage(datasetName, 'A basic reference dataset for brewery model', config.accountName(), config.containerName(), config.storagePath());
    // Check the information
    datasetManager.selectDataset(datasetName);
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Author');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Dave Lauper');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Creation date');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Source');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'AzureStorage');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'API URL');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Tags');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'AzureStorage');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Description');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'A basic reference dataset for brewery model');

    // Check you can edit metadata
    cy.get('[data-testid="CancelIcon"').click();
    cy.get('[data-cy="dataset-tags-tag-0"]').should('not.exist');
    cy.get('[data-cy=add-tag]', { force: true }).click({ force: true });
    cy.get('#new-tag-input').type('AzureStorageAgain', { force: true }).type('{enter}', { force: true });
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'AzureStorageAgain');
    cy.contains('A basic reference dataset for brewery model', { force: true }).click({ force: true });
    cy.get('#description-input').type('Updated description: ');
    cy.get('[data-cy="dataset-metadata-description"]').click();
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Updated description: A basic reference dataset for brewery model');
    datasetManager.clearSearch();

    // Check overview
    datasetManager.overviewDataset(datasetName);

    // Check you can create a scenario with the created dataset
    connection.navigate('scenario-view');
    scenario.createScenario(datasetName, 'master', datasetName, 'NoParameters');
    scenario.runScenario(datasetName);
  });

  it('PROD-13256 & PROD-12979 -> Create a subdataset and check Overview', () => {
    connection.connect();
    // Clean in case it's a second try
    datasetManager.deleteDataset('PROD-12909-sub');
    datasetManager.deleteDataset('PROD-12910-sub');
    scenario.deleteScenario('PROD-12909-sub');
    scenario.deleteScenario('PROD-12910-sub');

    connection.navigate('dataset');
    // Create a subdataset from a Local File dataset
    var datasetNameLocalFile = 'PROD-12909-sub';
    // Create the subdataset
    datasetManager.createSubDataset('PROD-12909', datasetNameLocalFile, 'This is a subdataset from a local file dataset');
    // Check the information
    datasetManager.selectDataset(datasetNameLocalFile);
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Author');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Dave Lauper');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Creation date');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Source');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'ETL');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'API URL');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Tags');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Subdataset');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Description');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'This is a subdataset from a local file dataset');

    // Check you can edit metadata
    cy.get('[data-testid="CancelIcon"').click({ multiple: true });
    cy.get('[data-cy="dataset-tags-tag-0"]').should('not.exist');
    cy.get('[data-cy=add-tag]', { force: true }).click({ force: true });
    cy.get('#new-tag-input').type('SubdatasetAgain', { force: true }).type('{enter}', { force: true });
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'SubdatasetAgain');
    cy.contains('This is a subdataset from a local file dataset', { force: true }).click({ force: true });
    cy.get('#description-input').type('Updated description: ');
    cy.get('[data-cy="dataset-metadata-description"]').click();
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Updated description: This is a subdataset from a local file dataset');
    datasetManager.clearSearch();
    // Check overview
    datasetManager.overviewDataset(datasetNameLocalFile);

    // Create a subdataset from a Azure Storage dataset
    var datasetNameAzureStorage = 'PROD-12910-sub';
    // Create the subdataset
    datasetManager.createSubDataset('PROD-12910', datasetNameAzureStorage, 'This is a subdataset from a local file dataset');
    // Check the information
    datasetManager.selectDataset(datasetNameAzureStorage);
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Author');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Dave Lauper');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Creation date');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Source');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'ETL');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'API URL');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Tags');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Subdataset');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Description');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'This is a subdataset from a local file dataset');

    // Check you can edit metadata
    cy.get('[data-testid="CancelIcon"').click({ multiple: true });
    cy.get('[data-cy="dataset-tags-tag-0"]').should('not.exist');
    cy.get('[data-cy=add-tag]', { force: true }).click({ force: true });
    cy.get('#new-tag-input').type('SubdatasetAgain', { force: true }).type('{enter}', { force: true });
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'SubdatasetAgain');
    cy.contains('This is a subdataset from a local file dataset', { force: true }).click({ force: true });
    cy.get('#description-input').type('Updated description: ');
    cy.get('[data-cy="dataset-metadata-description"]').click();
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Updated description: This is a subdataset from a local file dataset');
    datasetManager.clearSearch();
    // Check overview
    datasetManager.overviewDataset(datasetNameAzureStorage);

    // Check you can run scenario with the subdataset created
    connection.navigate('scenario-view');
    scenario.createScenario(datasetNameLocalFile, 'master', datasetNameLocalFile, 'NoParameters');
    scenario.runScenario(datasetNameLocalFile);
    scenario.createScenario(datasetNameAzureStorage, 'master', datasetNameAzureStorage, 'NoParameters');
    scenario.runScenario(datasetNameAzureStorage);
  });

  it('Clean datasets and scenarios', () => {
    connection.connect();
    connection.navigate('dataset');
    datasetManager.deleteDataset('PROD-12909-sub');
    datasetManager.deleteDataset('PROD-12910-sub');
    datasetManager.deleteDataset('PROD-12909');
    datasetManager.deleteDataset('PROD-12910');
    connection.navigate('manager');
    scenario.deleteScenario('PROD-12909-sub');
    scenario.deleteScenario('PROD-12910-sub');
    scenario.deleteScenario('PROD-12909');
    scenario.deleteScenario('PROD-12910');
  });

  it('PROD-14371: Edit dataset name', () => {
    connection.connect();

    // Clean in case it's a second try
    datasetManager.deleteDataset('DLOP-PROD-14371');
    datasetManager.deleteDataset('DLOP-Updated-PROD-14371');
    scenario.deleteScenario('DLOP-PROD-14371');

    connection.navigate('dataset');
    datasetManager.createDatasetLocalFile('DLOP-PROD-14371', 'A basic reference dataset for brewery model', 'reference');
    cy.wait(1000);
    scenario.createScenario('DLOP-PROD-14371', 'master', 'DLOP-PROD-14371', 'BreweryParameters');
    cy.get('[data-cy="dataset-name"]').should('contain', 'DLOP-PROD-14371');
    connection.navigate('dataset');
    datasetManager.searchDataset('DLOP-PROD-14371');
    cy.get('[data-cy="dataset-name"]').click({ force: true });
    cy.get('[data-cy="dataset-name-editable-text-field"]').find('input').clear().type('DLOP-Updated-PROD-14371').type('{enter}');

    // Check the old name is no longer in the dataset list
    datasetManager.searchDataset('DLOP-PROD-14371');
    cy.wait(1000);
    cy.get('[data-cy^="datasets-list-item-button-"]').should('not.exist');
    datasetManager.searchDataset('DLOP-Updated-PROD-14371');
    cy.get('[data-cy^="datasets-list-item-button-"]').should('have.length', 1);

    // Check the new name displays in scenario view
    scenario.searchScenarioInView('DLOP-PROD-14371');
    cy.get('[data-cy="dataset-name"]').should('contain', 'DLOP-Updated-PROD-14371');

    // Check the new name displays in the creation form
    connection.navigate('scenario-view');
    cy.get('[data-cy="create-scenario-button"]').click({ force: true });
    cy.get('#scenarioName').click().type('DLOP-Updated-PROD-14371');
    cy.get('[data-cy="create-scenario-dialog-master-checkbox"]').click({ force: true });
    cy.wait(500);
    cy.get('[placeholder="Select a dataset"]').click().clear().type('DLOP-PROD-14371');
    cy.wait(500);
    cy.get('[role="presentation"]').should('contain.text', 'No options');
    cy.wait(500);
    cy.get('[placeholder="Select a dataset"]').click().clear().type('DLOP-Updated-PROD-14371').type('{downarrow}').type('{enter}');
    cy.wait(500);
    cy.get('[placeholder="Select a dataset"]').should('have.value', 'DLOP-Updated-PROD-14371');
    cy.get('[data-cy="create-scenario-dialog-cancel-button"]').click({ force: true });

    // Run the scenario to check the updated name does not cause error
    scenario.runScenario('DLOP-PROD-14371');
    cy.get('[data-cy="scenario-datasets"]').should('have.text', 'DLOP-Updated-PROD-14371');

    // Delete scenario and dataset (no longer needed, no manual checks)
    datasetManager.deleteDataset('DLOP-Updated-PROD-14371');
    scenario.deleteScenario('DLOP-PROD-14371');
  });

  it('PROD-14372: Edit non-ETL dataset', () => {
    connection.connect();
    connection.navigate('dataset');
    // Select a dataset created without ETL (file)
    datasetManager.searchDataset('DLOP-Reference-for-automated-tests');
    cy.wait(1000);
    // Check there is no "Edit" button
    cy.get('[data-testid="EditIcon"]').should('not.exist');
  });
});
