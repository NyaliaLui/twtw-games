import { expect } from 'chai';

import { makeAriaQuery } from './e2eutils';

describe('Snake Page', () => {
  beforeEach(() => {
    cy.visit('/snake');
  });

  it('should render the HUD correctly', () => {
    // Main containers
    cy.get('div#score-board').within(() => {
      cy.get('div#max-score')
        .invoke('text')
        .then((text) => {
          expect(text).to.match(/Max: \d/);
        });

      cy.get('div#score')
        .invoke('text')
        .then((text) => {
          expect(text).to.match(/Score: \d/);
        });
    });
    cy.get('div#level-up')
      .invoke('text')
      .then((text) => {
        expect(text).to.match(/Level: \d/);
      });
    cy.get('div#stamina').should('exist');
    cy.get(makeAriaQuery('Move Up (W)')).should('exist');
    cy.get(makeAriaQuery('Move Left (A)')).should('exist');
    cy.get(makeAriaQuery('Move Down (S)')).should('exist');
    cy.get(makeAriaQuery('Move Right (D)')).should('exist');
    cy.get(makeAriaQuery('BOOST')).should('exist');
    cy.get('canvas').should('exist');
  });
});
