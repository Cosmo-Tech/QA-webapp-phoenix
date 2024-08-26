import 'cypress-file-upload';
var connection = require('../../functions/connect.cy.js');
var datasetManager = require('../../functions/datasetManager.cy.js');
var config = require('../../../variables.cy.js');
var scenario = require('../../functions/scenario.cy.js');

describe('Dataset Manager Sanity Checks', () => {
  it('PROD-12909 & PROD-12979 -> Create from Local File and check Overview', () => {
    connection.connect();
    connection.navigate('dataset');
    var datasetName = 'PROD-12909';
    // Create the dataset
    datasetManager.createDatasetLocalFile(datasetName, 'A basic reference dataset for brewery model', 'reference_dataset');
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
    datasetManager.overviewDataet(datasetName);

    // Check you can create a scenario with the created dataset
    connection.navigate('scenario-view');
    scenario.createScenario(datasetName, 'master', datasetName, 'NoParameters');
    scenario.runScenario(datasetName);
  });

  it('PROD-12910 & PROD-12979 -> Create from Azure Storage and check Overview', () => {
    connection.connect();
    connection.navigate('dataset');
    var datasetName = 'PROD-12910';
    // Create the dataset
    datasetManager.createDatasetAzureStorage(datasetName, 'A basic reference dataset for brewery model', 'csmphoenixdev', 'o-gzypnd27g7', 'w-70klgqeroooz/demobrewery');
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
    datasetManager.overviewDataet(datasetName);

    // Check you can create a scenario with the created dataset
    connection.navigate('scenario-view');
    scenario.createScenario(datasetName, 'master', datasetName, 'NoParameters');
    scenario.runScenario(datasetName);
  });

  it('PROD-12911 & PROD-12979 -> Create from ADT and check Overview', () => {
    connection.connect();
    connection.navigate('dataset');
    var datasetName = 'PROD-12911';
    // Create the dataset
    datasetManager.createDatasetADT(datasetName, 'A basic reference dataset for brewery model', 'https://o-gzypnd27g7-demobrewery.api.weu.digitaltwins.azure.net/');
    // Check the information
    datasetManager.selectDataset(datasetName);
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Author');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Dave Lauper');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Creation date');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Source');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'ADT');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'API URL');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Tags');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'ADT');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Description');
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'A basic reference dataset for brewery model');

    // Check you can edit metadata
    cy.get('[data-testid="CancelIcon"').click();
    cy.get('[data-cy="dataset-tags-tag-0"]').should('not.exist');
    cy.get('[data-cy=add-tag]', { force: true }).click({ force: true });
    cy.get('#new-tag-input').type('ADTAgain', { force: true }).type('{enter}', { force: true });
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'ADTAgain');
    cy.contains('A basic reference dataset for brewery model', { force: true }).click({ force: true });
    cy.get('#description-input').type('Updated description: ');
    cy.get('[data-cy="dataset-metadata-description"]').click();
    cy.get('[data-cy="dataset-metadata-card"]').should('contain', 'Updated description: A basic reference dataset for brewery model');
    datasetManager.clearSearch();
    // Check overview
    datasetManager.overviewDataet(datasetName);

    // Check you can create a scenario with the created dataset
    connection.navigate('scenario-view');
    scenario.createScenario(datasetName, 'master', datasetName, 'NoParameters');
    scenario.runScenario(datasetName);
  });

  it('PROD-13256 & PROD-12979 -> Create a subdataset and check Overview', () => {
    connection.connect();
    connection.navigate('dataset');

    // Create a subdataset from a Local File dataset
    var datasetNameLocalFile = 'PROD-12909-sub';
    // Create the subdataset
    datasetManager.createSubDataset('PROD-12909', datasetNameLocalFile, 'This is a subdataset from a local file dataset', 'Thirsty');
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
    datasetManager.overviewDataet(datasetNameLocalFile);

    // Create a subdataset from a Azure Storage dataset
    var datasetNameAzureStorage = 'PROD-12910-sub';
    // Create the subdataset
    datasetManager.createSubDataset('PROD-12910', datasetNameAzureStorage, 'This is a subdataset from a local file dataset', 'Thirsty');
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
    datasetManager.overviewDataet(datasetNameAzureStorage);

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
    datasetManager.deleteDataset('PROD-12911');
    connection.navigate('manager');
    scenario.deleteScenario('PROD-12909');
    scenario.deleteScenario('PROD-12910');
    scenario.deleteScenario('PROD-12911');
    scenario.deleteScenario('PROD-12909-sub');
    scenario.deleteScenario('PROD-12910-sub');
  });
});
