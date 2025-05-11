 //Test info account User and Delete account 
  describe('User Account', () => {
    it('Login, display user info and delete account', () => {
      
      cy.intercept('GET', '/api/user/29', {
        statusCode: 200,
        body: {
          id: 29,
          email: 'client@client.com',
          firstName: 'client',
          lastName: 'CLIENT',
          createdAt: '2025-05-01T10:00:00Z',
          updatedAt: '2025-05-01T10:00:00Z'
        }
      }).as('userInfo');
  
      cy.intercept('DELETE', '/api/user/29', {
        statusCode: 204
      }).as('deleteAccount');
  
      cy.loginAsUser();
  
      cy.contains('Account').click();
      cy.wait('@userInfo');
  
      cy.contains('Name: client CLIENT').should('exist');
      cy.contains('Email: client@client.com').should('exist');
      cy.contains('Delete my account').should('exist');
      cy.contains('Create at: May 1, 2025').should('exist');
      cy.contains('Last update: May 1, 2025').should('exist');
  
      cy.contains('Detail').click();
      cy.wait('@deleteAccount');
  
      cy.contains('Your account has been deleted !').should('be.visible');

      cy.contains('Login').should('be.visible');
      cy.contains('Register').should('be.visible');
    });
  });
  
  
  
  
  

