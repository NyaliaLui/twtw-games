describe('Root Navigation Checks', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render the correct headers and footers', () => {
    // === NAV ===
    cy.get('nav').within(() => {
      // Home link with <span> text
      cy.get('a[href="/"]')
        .first()
        .within(() => {
          cy.get('span').contains('Games & Animations');
        });

      // Hamburger button
      cy.get('button[data-collapse-toggle="navbar-hamburger"]')
        .should('exist')
        .click();

      // Links inside nav
      cy.get('a[href="/snake"]').contains('Snake');
      cy.get('a[href="/animation"]').contains('Animation Challenge');
    });

    // === FOOTER ===
    cy.get('footer').within(() => {
      cy.get('a[href="https://www.nyaliasoftware.solutions/"]').should('exist');
      cy.get('a[href="https://www.facebook.com/cityoftopeka"]').should('exist');
      cy.get('a[href="https://www.instagram.com/cityoftopeka/"]').should(
        'exist',
      );
      cy.get('a[href="https://github.com/NyaliaLui/twtw-games"]').should(
        'exist',
      );
    });

    // === SCRIPT ===
    cy.get(
      'script[src="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js"]',
    ).should('exist');
  });

  it('should render the about us content', () => {
    // Check for <h1>
    cy.get('h1').should('exist');

    // Check for exactly three <p> elements
    cy.get('p').should('have.length', 3);

    // Check for the Snake link
    cy.get('a[href="/snake"]').should('exist').contains('Snake');

    // Check for Animation link
    cy.get('a[href="/animation"]')
      .should('exist')
      .contains('Animation Challenge');

    // Check for the Animation link

    // Check for the Facebook link
    cy.get('a[href="https://www.facebook.com/cityoftopeka"]')
      .should('exist')
      .and('have.attr', 'target', '_blank')
      .contains('City of Topeka');

    // Check for the Instagram link
    cy.get('a[href="https://www.instagram.com/cityoftopeka/"]')
      .should('exist')
      .and('have.attr', 'target', '_blank')
      .contains('City of Topeka');

    // Check for one HR
    cy.get('hr').should('have.length', 1);
  });
});
