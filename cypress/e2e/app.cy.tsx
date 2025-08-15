import { expect } from "chai";

describe('Snake Navigation', () => {
  it('should navigate to the snake game', () => {
    // Start from the index page
    cy.visit('/');
 
    // Find a link with an href attribute containing "about" and click it
    cy.get('a[href*="snake"]').click({force: true});
 
    // The new url should include "/snake"
    cy.url().should('include', '/snake');
 
    // The new page should contain score divs
    cy.get('#max-score').invoke('text').then((text) => {
      expect(text).to.match(/Max: \d/);
    });

    cy.get('#score').invoke('text').then((text) => {
      expect(text).to.match(/Score: \d/);
    });
  });
});