import { expect } from 'chai';

import { closeHelpModal } from './e2eutils';

describe('Snake Page', () => {
  beforeEach(() => {
    cy.visit('/snake');
    closeHelpModal();
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
    cy.get('div#reset-win')
      .invoke('text')
      .then((text) => {
        expect(text).to.equal('Game Reset. Avoid boundaries!');
      });
    cy.get('div#stamina').should('exist');
    cy.get('div[data-testid="analog-stick"]').should('exist');
    cy.get('button[data-testid="shift-btn"]').should('exist');
    cy.get('canvas').should('exist');
  });
});
