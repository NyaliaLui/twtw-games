export { makeAriaQuery, closeHelpModal };

function makeAriaQuery(label: string) {
  return `[aria-label="${label}"]`;
}

function closeHelpModal() {
  cy.get('button[data-testid="close-help-modal"]').contains('Close').click();
}
