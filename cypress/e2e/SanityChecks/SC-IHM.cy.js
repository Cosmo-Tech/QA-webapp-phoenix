var connection = require('../../functions/connect.cy.js');
var datasetManager = require('../../functions/datasetManager.cy.js');
var config = require('../../../variables.cy.js');
var scenario = require('../../functions/scenario.cy.js');

describe('Global IHM and menu checks', () => {
  it('PROD-11913 -> Scenario view & Scenario Manager - IHM', () => {
    connection.connect();
    connection.navigate('scenario-view');
  });
});
