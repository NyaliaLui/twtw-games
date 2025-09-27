import { closeHelpModal } from './e2eutils';

describe('OrientationModal Component E2E Tests', () => {
  // Helper function to set mobile viewport in portrait
  const setMobilePortrait = () => {
    cy.viewport(375, 667); // iPhone SE dimensions
  };

  // Helper function to set desktop viewport
  const setDesktop = () => {
    cy.viewport(1920, 1080);
  };

  // Helper function to simulate mobile user agent
  const visitWithMobileUA = (path: string) => {
    cy.visit(path, {
      onBeforeLoad: (win) => {
        Object.defineProperty(win.navigator, 'userAgent', {
          value:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
          configurable: true,
        });
      },
    });
  };

  beforeEach(() => {
    // Start with desktop to avoid orientation modal by default
    setDesktop();
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing user agent gracefully', () => {
      setMobilePortrait();

      cy.visit('/snake', {
        onBeforeLoad: (win) => {
          // Remove user agent
          Object.defineProperty(win.navigator, 'userAgent', {
            value: undefined,
            configurable: true,
          });
        },
      });

      closeHelpModal();

      // Should still detect mobile by screen size and show modal
      cy.contains('Rotate Your Device').should('be.visible');
    });

    it('should handle window resize errors gracefully', () => {
      setMobilePortrait();
      visitWithMobileUA('/snake');
      closeHelpModal();

      // Modal should appear
      cy.contains('Rotate Your Device').should('be.visible');

      const checkResize = (w: number, h: number) => {
        cy.viewport(w, h);
        // Should still work correctly
        cy.contains('Rotate Your Device').should('be.visible');
      };

      // Trigger multiple rapid resizes
      checkResize(200, 300);
      checkResize(375, 667);
      checkResize(500, 800);
      checkResize(375, 667);
    });
  });

  describe('User Experience Flow', () => {
    it('should not show on non-game pages', () => {
      setMobilePortrait();
      visitWithMobileUA('/');

      // Should not show on home page
      cy.contains('Rotate Your Device').should('not.exist');

      // Should be able to navigate normally
      cy.get('a[data-testid="snake-btn"]').should('exist').click();

      // Now should show the modal
      closeHelpModal();
      cy.contains('Rotate Your Device').should('be.visible');
    });
  });
});
