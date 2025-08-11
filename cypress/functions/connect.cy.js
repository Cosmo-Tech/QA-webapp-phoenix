import { Login } from '../commons/actions/generic';
import { GENERIC_SELECTORS } from '../commons/constants/generic/IdConstants';
import { apiUtils as api } from '../commons/utils';
const config = require('../../variables.cy');

class ConnectToWebApp {
  //This function connect a generic user so it is possible to navigate in the solution for other tests
  static connect() {
    // The login connect directly to the correct workspace through the argument url: config.workspace()
    Login.login({ url: config.workspace() });

    // Set the language to English so cypress can assert texts with no confusion with French.
    // Navigate through the menu to reach the language parameters
    cy.get('[data-cy="user-profile-menu"]').click({ force: true });
    cy.get('[data-cy="change-language"]').click({ force: true });
    // Set language
    cy.get('[data-cy="set-lang-en"]').click({ force: true });
  }

  static logout() {
    cy.get('[data-cy="user-profile-menu"]').click({ force: true });
    cy.get('[data-cy="logout"]').click({ force: true });
  }

  // DEV function
  static getWorkspaceCardById(workspaceId) {
    return cy.get(GENERIC_SELECTORS.workspace.workspaceCard.replace('$WORKSPACEID', workspaceId));
  }

  // DEV function
  static connectWorkspace() {
    let workspaceID = config.workspace();
    const queries = api.interceptSelectWorkspaceQueries(workspaceID);
    this.getWorkspaceCardById(workspaceID).should('be.visible').find(GENERIC_SELECTORS.workspace.openButton).click();
    api.waitAliases(queries, { timeout: 60 * 1000 });
  }

  // Accepted values are scenario-view, dataset, dashboards, manager, digital-twin, technical, documentation, help and about
  static navigate(menuValue) {
    if (menuValue === 'scenario-view') {
      cy.get('[data-cy="tabs.scenario.key"]').click({ force: true });
      cy.url().should('contains', 'scenario');
    } else if (menuValue === 'dataset') {
      cy.get('[data-cy="tabs.datasetmanager.key"]').click({ force: true });
      cy.url().should('contains', 'datasetmanager');
    } else if (menuValue === 'dashboards') {
      cy.get('[data-cy="tabs.dashboards.key"]').click({ force: true });
      cy.url().should('contains', 'dashboards');
    } else if (menuValue === 'manager') {
      cy.get('[data-cy="tabs.scenariomanager.key"]').click({ force: true });
      cy.url().should('contains', 'scenariomanager');
    } else if (menuValue === 'digital-twin') {
      cy.get('[data-cy="tabs.instance.key"]').click({ force: true });
      cy.url().should('contains', 'instance');
    } else if (menuValue === 'about') {
      cy.get('[data-testid="HelpOutlineIcon"]').click({ force: true });
      cy.get('[data-cy="about-button"]').click({ force: true });
    } else if (menuValue === 'technical') {
      cy.get('[data-testid="HelpOutlineIcon"]').click({ force: true });
      cy.get('[data-cy="technical-info-button"]').click({ force: true });
    } else if (menuValue === 'documentation') {
      cy.get('[data-testid="HelpOutlineIcon"]').click({ force: true });
      cy.get('[data-cy="documentation-link"]').click({ force: true });
    } else if (menuValue === 'help') {
      cy.get('[data-testid="HelpOutlineIcon"]').click({ force: true });
      cy.get('[data-cy="support-link"]').click({ force: true });
    } else {
      cy.log('Unknown menu. This function accept only "scenario-view", "dataset", "dashboards", "manager", "digital-twin", "technical", "documentation", "help" or "about" as values.');
    }
  }

  static language(languageValue) {
    if (languageValue === 'EN') {
      // Navigate through the menu to reach the language parameters
      cy.get('[data-cy="user-profile-menu"]').click({ force: true });
      cy.get('[data-cy="change-language"]').click({ force: true });
      // Set language
      cy.get('[data-cy="set-lang-en"]').click({ force: true });
    } else if (languageValue === 'FR') {
      // Navigate through the menu to reach the language parameters
      cy.get('[data-cy="user-profile-menu"]').click({ force: true });
      cy.get('[data-cy="change-language"]').click({ force: true });
      // Set language
      cy.get('[data-cy="set-lang-fr"]').click({ force: true });
    } else {
      cy.log('Unknown language. This function accept only "EN" or "FR" as values.');
    }
  }
}

module.exports = ConnectToWebApp;
