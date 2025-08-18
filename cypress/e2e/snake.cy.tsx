import { expect } from "chai";

describe('Snake Page', () => {
  beforeEach(() => {
    cy.visit('/snake');
  });

  it('should render the HUD correctly', () => {
    // Main containers
    cy.get('div#score-board').within(() => {
        cy.get('div#max-score').invoke('text').then((text) => {
            expect(text).to.match(/Max: \d/);
        });

        cy.get('div#score').invoke('text').then((text) => {
            expect(text).to.match(/Score: \d/);
        });
    });
    cy.get('div#level-up').invoke('text').then((text) => {
        expect(text).to.match(/Level: \d/);
    });
    cy.get('div#stamina').should('exist');
    cy.get('div.keyboard-controls').contains('WASD to move • Shift to boost');
    cy.get('canvas').should('exist');
  });
});
