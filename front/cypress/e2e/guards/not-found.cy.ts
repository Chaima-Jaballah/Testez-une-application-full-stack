describe('404 - Not Found page', () => {
  it('redirects to /404 when visiting an unknown route', () => {
    cy.visit('/route-inexistante', { failOnStatusCode: false });
    cy.url().should('include', '/404');
    cy.contains('not found'); 
  });
});
