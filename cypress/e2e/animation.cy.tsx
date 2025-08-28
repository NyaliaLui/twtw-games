import { makeAriaQuery } from "./testutils";

describe('Animation Page', () => {
  beforeEach(() => {
    cy.visit('/animation');
  });

  it('should render the HUD correctly', () => {
    // Main containers
    cy.get(makeAriaQuery('Move Up (W)')).should('exist');
    cy.get(makeAriaQuery('Move Left (A)')).should('exist');
    cy.get(makeAriaQuery('Move Down (S)')).should('exist');
    cy.get(makeAriaQuery('Move Right (D)')).should('exist');
    cy.get(makeAriaQuery('RUN')).should('exist');
    cy.get('canvas').should('exist');
  });
});
