import { closeHelpModal } from './e2eutils';

describe('Animation Page', () => {
  beforeEach(() => {
    cy.visit('/animation');
    closeHelpModal();
  });

  it('should render the HUD correctly', () => {
    // Main containers
    cy.get('div[data-testid="analog-stick"]').should('exist');
    cy.get('button[data-testid="shift-btn"]').should('exist');
    cy.get('canvas').should('exist');
  });
});
