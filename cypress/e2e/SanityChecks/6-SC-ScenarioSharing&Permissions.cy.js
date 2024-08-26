import 'cypress-file-upload';
var connection = require('../../functions/connect.cy.js');
var datasetManager = require('../../functions/datasetManager.cy.js');
var config = require('../../../variables.cy.js');
var scenario = require('../../functions/scenario.cy.js');

describe('Scenario sharing feature and permissions', () => {
  it('', () => {
    connection.connect();
    connection.navigate('dataset');
  });
});
