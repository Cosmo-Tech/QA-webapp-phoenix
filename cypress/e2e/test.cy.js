import 'cypress-file-upload';
var connection = require('../functions/connect.cy.js');
var datasetManager = require('../functions/datasetManager.cy');

describe('Dataset Manager Sanity Checks', () => {
  it('PROD-12909 -> Create from Local File', () => {
    connection.connect();
    connection.navigate('dataset');
    });
});