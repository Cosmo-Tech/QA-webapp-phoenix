import 'cypress-file-upload';
var connection = require('../functions/connect.cy.js');
var datasetManager = require('../functions/datasetManager.cy.js');
var config = require('../../variables.cy.js');
var scenario = require('../functions/scenario.cy.js');

describe('This test will only connect the user to the webapp using the service account, for manual checking', () => {
  it('Connect to the webapp', () => {
    connection.connect();
    connection.navigate('manager');
  });
});
