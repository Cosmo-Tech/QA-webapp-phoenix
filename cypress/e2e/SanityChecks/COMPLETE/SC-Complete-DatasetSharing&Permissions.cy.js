import 'cypress-file-upload';
const connection = require('../../../functions/connect.cy.js');
const datasetManager = require('../../../functions/datasetManager.cy.js');
const config = require('../../../../variables.cy.js');
const scenario = require('../../../functions/scenario.cy.js');

describe('Dataset Manager Sharing and Permissions Sanity Checks', () => {
  it('PROD-13233 and PROD-13238 -> Share a dataset', () => {
    connection.connect();
    connection.navigate('dataset');
    const datasetName = 'DLOP-PROD-13233-Reference';

    // Clean in case it's a second try
    datasetManager.deleteDataset('DLOP-PROD-13233-Reference');

    // Create the dataset
    datasetManager.createDatasetLocalFile(datasetName, 'A basic reference dataset for brewery model', 'reference');
    datasetManager.selectDataset(datasetName);
    cy.wait(1000);

    // Click on share button and search for someone not in the organization
    cy.get('[data-testid="ShareIcon"]').click();
    cy.get('[placeholder="Add people"]').click().type('personne');
    // No option should be found
    cy.get('[data-cy*="share-scenario-dialog-agents-select-"]').should('not.exist');
    cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').click({ force: true });
    datasetManager.clearSearch();

    // Share the "viewer" permissions with someone
    datasetManager.shareDatasetUser(datasetName, config.permissionUserEmail(), config.permissionUserName(), 'viewer');

    // Remove access then cancel -> check access is not removed
    datasetManager.selectDataset(datasetName);
    cy.wait(1000);
    // Click on share button
    cy.get('[data-testid="ShareIcon"]').click();
    // Pass each user listed in the sharing wizard and check if the name is already here
    cy.get('[role="dialog"]')
      .find('[data-cy="role-editor-agent-name"]')
      .then(($el) => {
        cy.get($el).each(($txt) => {
          // Recover the text of the user names listed
          let userName = $txt.text();
          if (userName === config.permissionUserEmail()) {
            // Once the user is found, the access is removed by clicking the role dropdown menu and remove the role
            cy.get('[data-cy*="role-editor-' + config.permissionUserName() + '"]')
              .find('[aria-haspopup="listbox"]')
              .click({ force: true });
            cy.get('[data-cy="select-action-name"]').click({ force: true });
            // CANCEL the action
            cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').click({ force: true });
            // Get out of the loop
            return false;
          }
        });
      });
    // Reopen the share wizard and check if the user is still here
    cy.get('[data-testid="ShareIcon"]').click();
    cy.get('[role="dialog"]').should('contain', config.permissionUserEmail());
    cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').click({ force: true });
    datasetManager.clearSearch();

    // Remove the user access
    datasetManager.removeDatasetPermissionsUser(datasetName, config.permissionUserEmail(), config.permissionUserName());

    // Share the "editor" permissions with someone
    datasetManager.shareDatasetUser(datasetName, config.permissionUserEmail(), config.permissionUserName(), 'editor');

    // Remove the user access
    datasetManager.removeDatasetPermissionsUser(datasetName, config.permissionUserEmail(), config.permissionUserName());

    // Share the "admin" permissions with someone
    datasetManager.shareDatasetUser(datasetName, config.permissionUserEmail(), config.permissionUserName(), 'admin');

    // Check you're still admin even with someone else admin too. If no longer admin, delete button is no longer visible
    cy.get('[data-testid="DeleteForeverIcon"').should('exist');

    // Remove the user access
    datasetManager.removeDatasetPermissionsUser(datasetName, config.permissionUserEmail(), config.permissionUserName());

    // Update global permission to 'viewer'
    datasetManager.updateDatasetGlobal(datasetName, 'viewer');

    // Update global permission to 'editor'
    datasetManager.updateDatasetGlobal(datasetName, 'editor');

    // Update global permission to 'admin'
    datasetManager.updateDatasetGlobal(datasetName, 'admin');

    // Update global permission to 'viewer'
    datasetManager.updateDatasetGlobal(datasetName, 'viewer');

    // Remove global permissions
    datasetManager.removeDatasetPermissionsGlobal(datasetName);

    // Additionnal test: check it's not possible to remove the last admin
    datasetManager.selectDataset(datasetName);
    cy.wait(500);
    cy.get('[data-testid="ShareIcon"]').click();
    // Pass each user listed in the sharing wizard to find the owner
    cy.get('[role="dialog"]')
      .find('[data-cy="role-editor-agent-name"]')
      .then(($el) => {
        cy.get($el).each(($txt) => {
          // Recover the text of the user names listed
          let userName = $txt.text();
          if (userName === 'dev.sample.webapp@example.com') {
            // Once the owner is found, the access is removed by clicking the role dropdown menu and remove the role
            cy.get('[data-cy="role-editor-devsamplewebappexamplecom"]').find('[aria-haspopup="listbox"]').click({ force: true });
            cy.get('[data-cy="select-action-name"]').click({ force: true });
            // Check there is a warning message
            cy.get('[data-cy="no-admin-error-message"]').should('contain', 'The dataset must have at least one admin');
            cy.get('[data-cy="share-scenario-dialog-submit-button"]').should('have.attr', 'disabled');
            // Get out of the loop
            return false;
          }
        });
      });
    cy.get('[data-cy="share-scenario-dialog-first-cancel-button"]').click({ force: true });
    datasetManager.clearSearch();
    datasetManager.deleteDataset(datasetName);
  });

  it('PROD-13240, PROD-13235 -> Check permissions, need to be completed manually', () => {
    connection.connect();
    const datasetNameAdmin = 'DLOP-PROD-13240-Admin';
    const datasetNameEditor = 'DLOP-PROD-13240-Editor';
    const datasetNameViewer = 'DLOP-PROD-13240-Viewer';

    // Clean in case it's a second try
    datasetManager.deleteDataset(datasetNameAdmin);
    datasetManager.deleteDataset(datasetNameEditor);
    datasetManager.deleteDataset(datasetNameViewer);
    scenario.deleteScenario(datasetNameAdmin);
    scenario.deleteScenario(datasetNameEditor);
    scenario.deleteScenario(datasetNameViewer);

    connection.navigate('dataset');

    // Create the dataset Admin
    datasetManager.createDatasetLocalFile(datasetNameAdmin, 'A basic reference dataset for brewery model', 'reference');
    // Share the "admin" permissions with someone
    datasetManager.shareDatasetUser(datasetNameAdmin, config.permissionUserEmail(), config.permissionUserName(), 'admin');
    // Check admin permissions on owned dataset, using the function overview as this check the presence of the button "delete", only available if admin
    datasetManager.overviewDataset(datasetNameAdmin);

    // Create the dataset Editor
    datasetManager.createDatasetLocalFile(datasetNameEditor, 'A basic reference dataset for brewery model', 'reference');
    // Share the "admin" permissions with someone
    datasetManager.shareDatasetUser(datasetNameEditor, config.permissionUserEmail(), config.permissionUserName(), 'editor');
    // Check admin permissions on owned dataset, using the function overview as this check the presence of the button "delete", only available if admin
    datasetManager.overviewDataset(datasetNameEditor);

    // Create the dataset Viewer
    datasetManager.createDatasetLocalFile(datasetNameViewer, 'A basic reference dataset for brewery model', 'reference');
    // Share the "admin" permissions with someone
    datasetManager.shareDatasetUser(datasetNameViewer, config.permissionUserEmail(), config.permissionUserName(), 'viewer');
    // Check admin permissions on owned dataset, using the function overview as this check the presence of the button "delete", only available if admin
    datasetManager.overviewDataset(datasetNameViewer);

    connection.navigate('scenario-view');
    scenario.createScenario(datasetNameAdmin, 'master', datasetNameAdmin, 'NoParameters');
    scenario.runScenario(datasetNameAdmin);
    scenario.shareScenarioWithUser(datasetNameAdmin, config.permissionUserEmail(), config.permissionUserName(), 'admin');

    scenario.createScenario(datasetNameEditor, 'master', datasetNameEditor, 'NoParameters');
    scenario.runScenario(datasetNameEditor);
    scenario.shareScenarioWithUser(datasetNameEditor, config.permissionUserEmail(), config.permissionUserName(), 'admin');

    scenario.createScenario(datasetNameViewer, 'master', datasetNameViewer, 'NoParameters');
    scenario.runScenario(datasetNameViewer);
    scenario.shareScenarioWithUser(datasetNameViewer, config.permissionUserEmail(), config.permissionUserName(), 'admin');
    // Scenarios are not deleted, as they have to be manually checked. They will be deleted in the test SC-after.cy.js
  });

  it('PROD-13235 -> Overwrite Permissions', () => {
    connection.connect();
    connection.navigate('dataset');

    // Clean in case it's a second try
    datasetManager.deleteDataset('DLOP-PROD-13235-OverwritePermissions');
    scenario.deleteScenario('DLOP-PROD-13235-OverwritePermissions');

    // Create a dataset with Reference
    datasetManager.createDatasetLocalFile('DLOP-PROD-13235-OverwritePermissions', 'Check overwrite permissions', 'reference');
    // Create and run a scenario
    scenario.createScenario('DLOP-PROD-13235-OverwritePermissions', 'master', 'DLOP-PROD-13235-OverwritePermissions', 'NoParameters');
    scenario.runScenario('DLOP-PROD-13235-OverwritePermissions');
    scenario.shareScenarioWithUser('DLOP-PROD-13235-OverwritePermissions', config.permissionUserEmail(), config.permissionUserName(), 'admin');

    // Update global permissions to "viewer" while the permissions for the tester are set to "Admin"
    datasetManager.updateDatasetGlobal('DLOP-PROD-13235-OverwritePermissions', 'viewer');
    cy.wait(1000);
    datasetManager.shareDatasetUser('DLOP-PROD-13235-OverwritePermissions', config.permissionUserEmail(), config.permissionUserName(), 'admin');
    cy.wait(3000);

    // No deletion of the dataset, as manually checks are needed
  });

  it("PROD-13236 -> Check user with no permission can't see a dataset", () => {
    connection.connect();
    connection.navigate('dataset');

    // Clean in case it's a second try
    datasetManager.deleteDataset('DLOP-PROD-13236-NoPermissions');

    // Create a dataset with Reference
    datasetManager.createDatasetLocalFile('DLOP-PROD-13236-NoPermissions', 'Check user can not see a non shared dataset', 'reference');

    // Set permissions for the tester to "Admin" then remove the permissions
    datasetManager.shareDatasetUser('DLOP-PROD-13236-NoPermissions', config.permissionUserEmail(), config.permissionUserName(), 'admin');
    cy.wait(1000);
    datasetManager.removeDatasetPermissionsUser('DLOP-PROD-13236-NoPermissions', config.permissionUserEmail(), config.permissionUserName());

    // No deletion of the dataset, as manually checks are needed
  });
});
