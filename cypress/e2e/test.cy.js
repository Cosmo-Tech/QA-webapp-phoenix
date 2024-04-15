import 'cypress-file-upload';
var connection = require('../functions/connect.cy.js');
var datasetManager = require('../functions/datasetManager.cy');

describe('Dataset Manager Sanity Checks', () => {
  it('PROD-12909 -> Create from Local File', () => {
    connection.connect();
    connection.navigate('dataset');
    //datasetManager.createDatasetLocalFile('PROD-12909', 'A basic reference dataset for brewery model', 'reference_dataset')
    //datasetManager.searchDataset('')
    datasetManager.searchDataset('Reference-Test');
    cy.get('#dataset-search-bar', { timeout: 60000 }).clear();
  });
});

//cy.contains('SUSTAINMENT PLAN', { matchCase: false }).click();
