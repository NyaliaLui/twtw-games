describe('Animation Page', () => {
  beforeEach(() => {
    cy.visit('/animation');
  });

  it('should render the HUD correctly', () => {
    // Main containers
    cy.get('div.keyboard-controls').contains('WASD to move • Shift to run');
    cy.get('canvas').should('exist');
  });
});
