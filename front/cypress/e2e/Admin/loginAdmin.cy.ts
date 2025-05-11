describe('Login and Logout Admin', () => {
  it('Login successful', () => {
    cy.loginAsAdmin();
  });

  
  it('Logout successfully', () => {
      cy.contains('Logout').click();
      cy.location('pathname').should('eq', '/');
      cy.contains('Login').should('be.visible');
      cy.contains('Register').should('be.visible');
    });

  });  