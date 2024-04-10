import 'cypress-file-upload';
var connection = require('../functions/connect.cy.js');
var datasetManager = require('../functions/datasetManager.cy');

describe('Dataset Manager Sanity Checks', () => {
  it('PROD-12909 -> Create from Local File', () => {
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

    // Delete the dataset
    datasetManager.deleteDataset(datasetName);
  });
});
